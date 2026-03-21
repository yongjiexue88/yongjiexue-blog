import './ParallaxBalloonHero.scss'
import React from 'react'
import { Parallax } from 'react-next-parallax'

/**
 * Balloon parallax hero banner — adapted from portfolio-main/ParallaxBalloonLight.tsx
 * Multiple layered balloon images at different data-parallax-offset depths
 * create a rich 3D effect on mouse movement.
 */
const defaultItems = [
    { offset: -4.5, img: 'images/showcase/tech_hero/tech_04.png' }, // Particles (back)
    { offset: -3,   img: 'images/showcase/tech_hero/tech_03.png' }, // Nano elements
    { offset: -2,   img: 'images/showcase/tech_hero/tech_02.png' }, // Banana
    { offset: -1,   img: 'images/showcase/tech_hero/tech_01.png' }, // Gemini Logo (center)
    { offset:  2,   img: 'images/showcase/tech_hero/tech_02.png' }, // Banana (front)
    { offset:  3,   img: 'images/showcase/tech_hero/tech_03.png' }, // Nano elements (front)
    { offset:  4.5, img: 'images/showcase/tech_hero/tech_04.png' }, // Particles (front)
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

                {/* Floating tech banana outside the clipped area */}
                <img
                    data-parallax-offset="4.5"
                    src="images/showcase/tech_hero/tech_02.png"
                    className="parallax-balloon-img parallax-balloon-floating"
                    alt=""
                />
            </Parallax>
        </div>
    )
}

export default ParallaxBalloonHero
