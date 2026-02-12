"use client"; // Keep this directive for Next.js App Router

import React from 'react';
import SphereScene from './SphereScene';

// Component-specific styles have been updated for the new layout.
const styles = `
/* Main container - spheres fill viewport, header overlays on top */
.intro-container {
  background: #253237;
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header overlaid in front of spheres - positioned above center */
.main-header {
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 4rem;
  font-weight: bold;
  color: #EFEFEF;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.5);
  pointer-events: none;
}

/* Spheres container - fills viewport */
.spheres-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.spheres-hint {
  color: #EFEFEF;
  font-size: 1rem;
  margin-top: 1rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  pointer-events: none;
}
`;

// The Intro component renders the header and 3D spheres.
const Intro = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="intro-container">
        <h1 className="main-header">PhaseMatrix Media</h1>
        <div className="spheres-container">
          <SphereScene />
          <p className="spheres-hint">click the Spheres to explore the site</p>
        </div>
      </div>
    </>
  );
};

export default Intro;