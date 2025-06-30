
"use client"; // Include this if your About component has client-side interactions

import React from 'react';
// Adjust the import path for your About component based on its location relative to app/about/page.js
// Assuming 'Pages' is a sibling of 'app' in the project root:
import About from '../../../../Pages/About/about';

export const metadata = {
  title: 'About Me', // Specific title for the About page
  description: 'Learn more about me and my portfolio.',
};


export default function AboutPage() {
  return (
    <About />
  );
}