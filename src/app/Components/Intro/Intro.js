"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Theme, Box, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";

const WORDS = ["Click", "the", "Spheres", "to", "explore", "the", "site."];

const Intro = () => {
  const wordRefs = useRef([]);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);
    if (!words.length) return;

    gsap.from(words, {
      opacity: 0,
      x: 40,
      rotationY: -60,
      duration: 0.5,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.4,
    });
  }, []);

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <Box className="intro-container w-full max-w-[1400px] mx-auto flex flex-col items-center" align="center" justify="center">
          <Box className="w-full">
            <SphereScene />
          </Box>
          <Box className="w-full flex justify-center intro-footer-text" style={{ perspective: "600px" }}>
            <Text size="9" color="orange" className="nabla-footer text-center">
              {WORDS.map((word, i) => (
                <span
                  key={i}
                  ref={(el) => (wordRefs.current[i] = el)}
                  style={{ display: "inline-block", marginRight: "0.2em", transformStyle: "preserve-3d" }}
                >
                  {word}
                </span>
              ))}
            </Text>
          </Box>
        </Box>
        <Analytics />
        <SpeedInsights />
    </Theme>
  );
};

export default Intro;