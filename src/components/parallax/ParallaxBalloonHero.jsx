import './ParallaxBalloonHero.scss'
import React from 'react'
import { Parallax } from 'react-next-parallax'

/**
 * Balloon parallax hero banner — adapted from portfolio-main/ParallaxBalloonLight.tsx
 * Multiple layered balloon images at different data-parallax-offset depths
 * create a rich 3D effect on mouse movement.
 */
const defaultItems = [
    { offset: -4.5, img: 'images/showcase/balloon_light/01.webp' },
    { offset: -3,   img: 'images/showcase/balloon_light/03.webp' },
    { offset: -2,   img: 'images/showcase/balloon_light/02.webp' },
    { offset: -1,   img: 'images/showcase/balloon_light/04.webp' },
    { offset:  2,   img: 'images/showcase/balloon_light/07.webp' },
    { offset:  3,   img: 'images/showcase/balloon_light/05.webp' },
    { offset:  4.5, img: 'images/showcase/balloon_light/08.webp' },
]

function ParallaxBalloonHero({ items = defaultItems }) {
    return (
        <div className="parallax-balloon-hero-wrapper">
            <Parallax
                className="parallax-balloon-hero"
                borderRadius="24px"
                overflowHiddenEnable={false}
                shadowType="drop"
                lineGlareEnable={false}
                shadow="0 0 1rem rgba(0,0,0,0.5)"
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                spotGlareEnable={false}
            >
                <div className="parallax-balloon-hero-inner">
                    {items.map((item, index) => (
                        <img
                            key={index}
                            data-parallax-offset={item.offset}
                            src={item.img}
                            alt=""
                            className={`parallax-balloon-img ${index === 5 ? 'balloon-float-special' : ''}`}
                        />
                    ))}
                </div>

                {/* Floating balloon outside the clipped area */}
                <img
                    data-parallax-offset="4.5"
                    src="images/showcase/balloon_light/06.webp"
                    className="parallax-balloon-img parallax-balloon-floating"
                    alt=""
                />
            </Parallax>
        </div>
    )
}

export default ParallaxBalloonHero
