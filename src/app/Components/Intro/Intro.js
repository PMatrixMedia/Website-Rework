"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Theme, Box, Text, Container } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";

const WORDS = ["Click", "the", "Spheres", "to", "explore", "the", "site..."];

const Intro = () => {
  const wordRefs = useRef([]);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);
    if (!words.length) return;

    gsap.from(words, {
      opacity: 0,
      x: 40,
      rotationY: -80,
      duration: 0.5,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.4,
    });
  }, []);

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <Box className="absolute inset-x-0 top-0">
          <Container>
          <Box className="relative inset-x-0 top-0">
            <SphereScene />
          </Box>
          </Container>
          <Box className="relative z-10 flex justify-center-safe px-3 pb-3 pt-3 text-base sm:px-4 sm:pb-4 sm:pt-4 sm:text-lg md:px-6 md:pb-6 md:pt-6 md:text-xl lg:text-2xl" style={{ perspective: "600px" }}>
            <Container>
            <Text size="9" color="orange" className="nabla-footer text-center">
              {WORDS.map((word, i) => (
                <span
                  key={i}
                  ref={(el) => (wordRefs.current[i] = el)}
                  style={{ display: "inline-block", marginRight: "0.4em", transformStyle: "preserve-3d" }}
                >
                  {word}
                </span>
              ))}
            </Text>
            </Container>
          </Box>
        </Box>
        <Analytics />
        <SpeedInsights />
    </Theme>
  );
};

export default Intro;