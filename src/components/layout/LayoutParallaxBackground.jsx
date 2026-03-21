import React from 'react';
import { Parallax } from 'react-next-parallax';
import './LayoutParallaxBackground.scss'; // Optional custom styling

function LayoutParallaxBackground() {
  return (
    <div className="layout-parallax-background">
      <Parallax
        className="parallax-wrapper"
        borderRadius="24px"
        overflowHiddenEnable={false}
        shadowType="drop"
        lineGlareEnable={false}
        shadow="0 0 1rem rgba(0,0,0,0.5)"
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        spotGlareEnable={false}
      >
        <div className="container" style={{ position: 'relative', height: '100%', width: '100%' }}>
          <img 
            src="images/parallax/01.webp" 
            data-parallax-offset="-5" 
            alt="Parallax 1" 
            style={{ position: 'absolute', top: '20%', left: '10%', width: '150px' }}
          />
          <img 
            src="images/parallax/03.webp" 
            alt="Parallax 2" 
            style={{ position: 'absolute', top: '50%', left: '40%', width: '200px' }}
          />
          <img 
            src="images/parallax/07.webp" 
            data-parallax-offset="5" 
            alt="Parallax 3" 
            style={{ position: 'absolute', top: '70%', left: '70%', width: '100px' }}
          />
        </div>
      </Parallax>
    </div>
  );
}

export default LayoutParallaxBackground;
