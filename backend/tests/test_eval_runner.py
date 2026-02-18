"""Integration-like tests for evaluation runner artifact outputs."""

import json
from pathlib import Path

import pytest
from google.api_core.exceptions import ResourceExhausted

import evaluation.runner as runner
from evaluation.judges import JudgeOutput, JudgeResult


class FakeEmbeddingService:
    def embed_query(self, text: str):
        return [0.1, 0.2, 0.3]


class FakeVectorStoreService:
    def search(self, query_embedding, top_k=5):
        return {
            "documents": [["Doc text A", "Doc text B"]],
            "metadatas": [[{"source": "docA.md"}, {"source": "docB.md"}]],
            "distances": [[0.1, 0.2]],
        }


class FakeLLMService:
    current_model_name = "fake-model"

    async def generate_with_metadata(self, **kwargs):
        return "fake answer", {
            "prompt_tokens": 10,
            "completion_tokens": 5,
            "total_tokens": 15,
            "latency_ms": 10.0,
            "model_name": "fake-model",
        }


class FakeJudge:
    def __init__(self, name: str):
        self.name = name

    async def evaluate(self, **kwargs):
        output = JudgeOutput(
            score=0.9,
            decision="pass",
            error_type="none",
            citations=[{"source": "docA.md", "snippet": "Doc text A"}],
            uncertainty=False,
            reasons=["looks good"],
        )
        return JudgeResult(name=self.name, output=output, usage={})


def _make_dataset(tmp_path, rows):
    dataset_path = tmp_path / "eval.jsonl"
    dataset_path.write_text(
        "\n".join(json.dumps(r) for r in rows) + "\n", encoding="utf-8"
    )
    return dataset_path


def _apply_fakes(monkeypatch, reports_dir):
    monkeypatch.setattr(runner, "EmbeddingService", FakeEmbeddingService)
    monkeypatch.setattr(runner, "VectorStoreService", FakeVectorStoreService)
    monkeypatch.setattr(runner, "LLMService", FakeLLMService)
    monkeypatch.setattr(runner, "GroundednessJudge", lambda llm_service: FakeJudge("groundedness"))
    monkeypatch.setattr(runner, "QualityJudge", lambda llm_service: FakeJudge("quality"))
    monkeypatch.setattr(runner, "REPORTS_DIR", reports_dir)


_SAMPLE_ROWS = [
    {
        "id": "1",
        "query": "question 1",
        "gold_doc_ids": ["docA.md"],
        "gold_chunk_refs": [{"source": "docA.md", "relevance": 1.0}],
        "reference_answer": "answer",
        "tags": {"split": "dev"},
    },
    {
        "id": "2",
        "query": "question 2",
        "gold_doc_ids": ["docB.md"],
        "gold_chunk_refs": [{"source": "docB.md", "relevance": 1.0}],
        "reference_answer": "answer",
        "tags": {"split": "holdout"},
    },
]


@pytest.mark.asyncio
async def test_runner_writes_reports(tmp_path, monkeypatch):
    dataset_path = _make_dataset(tmp_path, _SAMPLE_ROWS)
    reports_dir = tmp_path / "reports"
    _apply_fakes(monkeypatch, reports_dir)

    output = await runner.run_evaluation(
        mode="full_rag_with_judges",
        dataset_path=dataset_path,
        limit=None,
        top_k=2,
        delay=0,
    )

    assert output["total_samples"] == 2
    assert (reports_dir / "retrieval_metrics.json").exists()
    assert (reports_dir / "answer_metrics.json").exists()
    assert (reports_dir / "latency_cost_metrics.json").exists()
    assert (reports_dir / "examples_failed.jsonl").exists()


@pytest.mark.asyncio
async def test_legacy_cli_entrypoint_behavior(tmp_path, monkeypatch):
    dataset_path = _make_dataset(tmp_path, _SAMPLE_ROWS[:1])
    reports_dir = tmp_path / "reports"
    _apply_fakes(monkeypatch, reports_dir)

    output = await runner.run_evaluation(
        mode="retrieval_only", dataset_path=dataset_path, top_k=2, delay=0,
    )
    assert output["mode"] == "retrieval_only"


@pytest.mark.asyncio
async def test_runner_retries_on_rate_limit(tmp_path, monkeypatch):
    """Runner should retry on 429 and still produce reports."""

    call_count = 0

    class RateLimitedLLMService:
        current_model_name = "fake-model"

        async def generate_with_metadata(self, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise ResourceExhausted("429 Resource exhausted")
            return "fake answer", {
                "prompt_tokens": 10,
                "completion_tokens": 5,
                "total_tokens": 15,
                "latency_ms": 10.0,
                "model_name": "fake-model",
            }

    dataset_path = _make_dataset(tmp_path, _SAMPLE_ROWS[:1])
    reports_dir = tmp_path / "reports"

    monkeypatch.setattr(runner, "EmbeddingService", FakeEmbeddingService)
    monkeypatch.setattr(runner, "VectorStoreService", FakeVectorStoreService)
    monkeypatch.setattr(runner, "LLMService", RateLimitedLLMService)
    monkeypatch.setattr(runner, "GroundednessJudge", lambda llm_service: FakeJudge("groundedness"))
    monkeypatch.setattr(runner, "QualityJudge", lambda llm_service: FakeJudge("quality"))
    monkeypatch.setattr(runner, "REPORTS_DIR", reports_dir)
    # Use very short retry delays for tests
    monkeypatch.setattr(runner, "_RETRY_BASE_DELAY", 0.01)
    monkeypatch.setattr(runner, "_RETRY_MAX_DELAY", 0.02)

    output = await runner.run_evaluation(
        mode="full_rag_with_judges",
        dataset_path=dataset_path,
        limit=None,
        top_k=2,
        delay=0,
    )

    assert output["total_samples"] == 1
    assert (reports_dir / "retrieval_metrics.json").exists()
    # The first call failed, retry succeeded — no rate_limited failures
    summary = output["summary"]
    assert summary["evaluated_samples"] == 1
