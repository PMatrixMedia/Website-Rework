"use client"; // Use this if you are in a Next.js App Router environment

import React, { useState } from 'react';
import PropTypes from 'prop-types';

// --- Helper Components & Styles ---
// Since the original code imports external components and CSS,
// these are simple placeholders to make this example runnable.

const GlobalStyles = `
  /* Mock styles from bootstrap.css and style.css */
  .Jumbotron {
    background-color: #e9ecef;
    padding: 2rem 1rem;
    margin-bottom: 2rem;
    border-radius: 0.3rem;
  }
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  .media {
    display: flex;
    align-items: flex-start;
  }
  .media-body {
    flex: 1;
  }
  .avatar {
    margin-right: 1.5rem;
  }
  .profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .bodyheading {
    font-size: 2.5rem;
    font-weight: 300;
  }
  .bodytext {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

// Placeholder for the Navbar component
const RSnavbar = () => (
  <nav style={{ padding: '1rem', backgroundColor: '#343a40', color: 'white', textAlign: 'center' }}>
    <p style={{ margin: 0 }}>Navbar Placeholder</p>
  </nav>
);

// Placeholder for the Banner component
const Banner = () => (
  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '.25rem' }}>
    <p style={{ margin: 0 }}>Banner Component Placeholder</p>
  </div>
);

// Mock image import
const avatarImg = 'https://placehold.co/150x150/6c757d/white?text=Avatar';


// --- Refactored About Component ---

const About = () => {
  // The 'useState' hook replaces the class component's state and setState.
  const [isOpen, setIsOpen] = useState(false);

  // The toggle function now directly calls the state updater function.
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <style>{GlobalStyles}</style>
      <RSnavbar />
      <div className="Jumbotron">
        <div className="container">
          <div className="media">
            <div className="avatar">
              <img className='profile-image' src={avatarImg} alt="User Avatar" />
            </div>
            <div className="media-body">
              <h1 className='bodyheading'>About Me</h1>
              <div className='bodytext'>
                <p>
                  I am a full-stack web developer with experience in both React and Angular. Major technologies I've used include, but not exclusive to Powershell, HTML5, CSS3, JavaScript, jQuery, Node, Express, MySQL, MongoDB, Mongoose, and Handlebars.
                  I also have a very extensive background in windows based administration and SCCM.
                </p>
                <Banner />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
