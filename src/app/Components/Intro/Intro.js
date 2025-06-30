"use client"; // Keep this directive for Next.js App Router

import React from 'react';
import PropTypes from 'prop-types';
// import About from '../../Pages/About/about.js' // REMOVE: Not used directly in Intro
// import '../../Pages/About/style.css' // REMOVE: Style for About page should be imported by About page itself
import { useRouter } from 'next/navigation'; // ADD: Import useRouter for client-side navigation

// Component-specific styles have been updated for the new layout.
const styles = `
/* Main container to center the content on the page */
.intro-container {
  background: #253237;
  height: 100vh;
  width: 100%;
  display: flex;
  /* Updated to stack header and circles vertically */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* New style for the main header */
.main-header {
    font-size: 5rem; /* Increased header size */
    font-weight: bold;
    color: #EFEFEF;
    margin-bottom: 50px; /* Creates space between the header and circles */
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* Wrapper to lay out circles using flexbox */
.overlapping-circles-container {
  display: flex;
  align-items: center;
}

/* The circle element */
.circle-container {
  width: 400px; /* Doubled from 200px */
  height: 400px; /* Doubled from 200px */
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative; /* Needed for z-index stacking */
  /* Updated box-shadow for a more pronounced effect below the circle */
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  /* Added a border to better distinguish the overlapping circles */
  border: 6px solid #253237; /* Increased border size */
}

/* This is the key part for the overlapping effect.
 * It selects every circle-container except for the first one.
*/
.overlapping-circles-container > .circle-container:not(:first-of-type) {
    margin-left: -200px; /* Overlap by 50% of the new width (400px) */
}

/* On hover, scale the circle and bring it to the front */
.circle-container:hover {
    transform: scale(1.1) translateY(-20px); /* Increased hover effect */
    z-index: 10 !important; /* Use !important to override inline z-index */
    /* Updated box-shadow for a stronger "lifted" effect */
    box-shadow: 0 25px 50px rgba(0,0,0,0.35);
}

.page-number-on-circle {
  position: absolute;
  top: 30px; /* Position from the top */
  left: 64px; /* Position from the left edge (56px + 8px) */
  font-size: 24px; /* Increased font size */
  opacity: 0.7;
  font-weight: bold;
}

.circle-text-content {
  text-align: center;
  padding: 20px;
}

.stripe-within-circle {
  padding: 15px; /* Increased padding */
  margin: 15px auto; /* Increased margin */
  border-radius: 15px; /* Increased border-radius */
  width: 90%;
  background-color: rgba(0,0,0,0.1); /* Slight inner shadow for depth */
}

/* Gradients */
.pink {
  background: linear-gradient(to right, #ff7e5f, #feb47b);
}

/* New blue gradient */
.blue {
  background: linear-gradient(to right, #2193b0, #6dd5ed);
}

.tomato {
    background: linear-gradient(to right, #ff6347, #ff4500);
}
`;

// The Page component now just renders the circle UI.
const Page = ({ gradient, caption, first, second, pageNumber, navPath }) => {
  const router = useRouter(); // Initialize the router hook

  const handleClick = () => {
    if (navPath) {
      if (navPath.startsWith('http://') || navPath.startsWith('https://')) {
        window.open(navPath, '_blank', 'noopener,noreferrer');
      } else {
        // Use router.push for internal navigation
        router.push(navPath);
      }
    }
  };

  return (
    <div
        className={`circle-container ${gradient}`}
        onClick={handleClick}
        style={{ zIndex: pageNumber, cursor: navPath ? 'pointer' : 'default' }}
    >
      <span className="page-number-on-circle">0{pageNumber}</span>
      <div className="circle-text-content">
        {/* Adjusted font sizes for larger circles */}
        <p style={{ fontSize: '32px', margin: '10px 0' }}>{caption}</p>
        <div className={`stripe-within-circle`}>
          <p style={{ fontSize: '28px', margin: '10px 0' }}>{first}</p>
          {second && <p style={{ fontSize: '16px', margin: '5px 0' }}>{second}</p>}
        </div>
      </div>
    </div>
  );
};

Page.propTypes = {
  gradient: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  first: PropTypes.string.isRequired,
  second: PropTypes.string,
  pageNumber: PropTypes.number.isRequired,
  navPath: PropTypes.string,
};

Page.defaultProps = {
  second: '',
  navPath: '',
};

// The Intro component now renders the header and the static layout.
const Intro = () => {

  const pageData = [
    { gradient: "pink", caption: "Home", first: "Click to Explore", second: "Main Site", navPath: "/main" },
    { gradient: "blue", caption: "VR & AR", first: "Projects & Services", navPath: "https://phasevr-pmatrix.vercel.app/" },
    { gradient: "tomato", caption: "Who I am", first: "Portfolio", navPath: "/about" }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="intro-container">
        {/* The new header element */}
        <h1 className="main-header">PhaseMatrix Media</h1>
        <div className="overlapping-circles-container">
          {pageData.map((page, index) => (
            <Page
              key={index}
              gradient={page.gradient}
              caption={page.caption}
              first={page.first}
              second={page.second}
              // Reverse the page number to control z-index stacking.
              // This makes the first circle appear on top.
              pageNumber={pageData.length - index}
              navPath={page.navPath}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Intro;