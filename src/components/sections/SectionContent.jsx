import "./SectionContent.scss"
import React, {useEffect, useState} from 'react'
import SectionHeader from "/src/components/sections/SectionHeader.jsx"
import SectionBody from "/src/components/sections/SectionBody.jsx"
import ParallaxBalloonHero from "/src/components/parallax/ParallaxBalloonHero.jsx"

function SectionContent({ section }) {
    const isAboutSection = section?.id === 'about'

    return (
        <div className={`section-content`}>
            <div className={`section-content-border-decoration section-content-border-decoration-top-left`}/>

            {isAboutSection && <ParallaxBalloonHero />}

            <div className={`section-content-elements-wrapper`}>
                <SectionHeader section={section}/>
                <SectionBody section={section}/>
            </div>
        </div>
    )
}

export default SectionContent