"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Theme, Box, Text, Heading, Container } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import SphereScene from "./SphereScene";
import LetterGlitch from "./LetterGlitch";

gsap.registerPlugin(ScrambleTextPlugin);

const WORDS = ["Click", "the", "Spheres", "to", "explore", "the", "site..."];

const BANNER_BLURB = "Creative Technology -  Digital Worlds - Real Impact";

const Intro = () => {
  const wordRefs = useRef([]);
  const bannerRef = useRef(null);

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

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        duration: 4,
        scrambleText: {
          text: BANNER_BLURB,
          speed: 1.0,
        },
        delay: 4,
        repeat: -1,
        repeatDelay: 6,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <Box className="relative min-h-dvh w-full">
          <Box
            className="pointer-events-none fixed inset-0 z-0 min-h-dvh w-full"
            aria-hidden
          >
            <LetterGlitch
              glitchColors={["#052e16", "#166534", "#22c55e", "#4ade80", "#86efac"]}
              glitchSpeed={55}
              outerVignette
              centerVignette={false}
              smooth
            />
          </Box>
        <Box className="relative z-10 min-h-dvh w-full">
        <Box className="absolute inset-x-0 top-1">
          <Container>
          <Box className="relative inset-x-1 top-3">
            <Box
              className="relative z-20 w-full min-w-0 bg-black px-0 pb-2 pt-0 sm:px-0 sm:pb-2 sm:pt-0 md:px-0 [&::-webkit-scrollbar]:hidden"
              style={{
                pointerEvents: "none",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <Heading
                as="h1"
                size="6"
                weight="regular"
                color="orange"
                className="asimovian-regular m-0 w-full text-center leading-tight pb-[0.1em]"
                style={{
                  textDecoration: "none",
                  fontFamily: "Asimovian",
                  fontWeight: "normal",
                  fontStyle: "normal",
                  fontVariationSettings: "normal",
                  fontStretch: "normal",
                  fontVariant: "normal",
                  fontVariantLigatures: "normal",
                  fontVariantNumeric: "normal",
                  fontSize:
                    "clamp(1.525rem, max(1.8875rem, min(5.5vw, 2.75rem)), 2.75rem)",
                }}
              >
                <span
                  ref={bannerRef}
                  className="block w-full whitespace-nowrap"
                >
                  {BANNER_BLURB}
                </span>
              </Heading>
            </Box>
            <div className="relative inset-x-3 top-3">
            <SphereScene />
            </div>
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
        </Box>
        </Box>
        <Analytics />
        <SpeedInsights />
    </Theme>
  );
};

export default Intro;