"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import avatarImg from "./avatar(2).jpg";

const HomeIcon = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Component Placeholder / dialog box (light grey)
const BannerPlaceholder = () => (
  <div
    className="component-placeholder"
    style={{
      width: "100%",
      padding: "1rem 1.25rem",
      backgroundColor: "#9ca3af",
      borderRadius: "0.25rem",
      color: "#374151",
      fontSize: "0.9rem",
    }}
  >
    Your Webmaster
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Top Banner - Dark Grey */}
      <div
        className="about-banner"
        style={{
          backgroundColor: "#4b5563",
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* About Me - Centered at top */}
        <h1
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "1.25rem",
            fontWeight: 500,
            margin: 0,
          }}
        >
          About Me
        </h1>

        {/* Main row: Profile (left) | Right: Icons above Placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {/* Left: Profile pic */}
          <img
            src={avatarImg.src}
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          />

          {/* Right: Icons above Component Placeholder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.75rem",
              flex: 1,
              minWidth: 200,
            }}
          >
            {/* Image buttons - above the dialog box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
            <Link
              href="/"
              aria-label="Home"
              className="hover:opacity-80 transition-opacity"
            >
              <HomeIcon />
            </Link>
            <a
              href="https://github.com/PMatrixMedia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/github.png"
                alt="GitHub"
                width={38}
                height={38}
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/christopher-faison-1b7b6948"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/linkedin.png"
                alt="LinkedIn"
                width={90}
                height={38}
              />
            </a>
            <a
              href="https://codesandbox.io/u/PMatrixMedia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CodeSandbox"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/codesandbox-logo.png"
                alt="CodeSandbox"
                width={187}
                height={50}
              />
            </a>
            </div>
            <BannerPlaceholder />
          </div>
        </div>
      </div>

      {/* Main Content - Black background, white text */}
      <div
        style={{
          backgroundColor: "#000",
          padding: "3rem 2rem",
          minHeight: "50vh",
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "2.15rem",
            lineHeight: 1.8,
            maxWidth: 1000,
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
        <p>    Creative React Developer with 8 years designing useful, approachable user
           interfaces. Knowledgeable on all aspects of Facebooks design best practices 
           and emerging UI development techniques. Skilled at connecting exceptional 
           assets with users via creative UI frameworks and careful user experience 
           optimization. Organized and dependable candidate successful at managing 
           multiple priorities with a positive attitude. Willingness to take on added
           responsibilities to meet team goals.
           </p>
        </p>
      </div>
    </div>
  );
};

export default About;
