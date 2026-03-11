"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
  Theme,
  Box,
  Flex,
  Container,
  Text,
  Avatar,
  Heading,
  Card,
  Strong,
  Blockquote
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import avatarImg from "./avatar(2).jpg";

const BLOCKQUOTE_TEXT =
  "Creative React Developer with 8 years designing useful, approachable user interfaces. Knowledgeable on all aspects of Facebook's design best practices and emerging UI development techniques. Skilled at connecting exceptional assets with users via creative UI frameworks and careful user experience optimization. Organized and dependable candidate successful at managing multiple priorities with a positive attitude. Willingness to take on added responsibilities to meet team goals.";

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

export default function About() {
  const headingRef = useRef(null);
  const navRef = useRef(null);
  const cardRef = useRef(null);
  const blockquoteRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.9,
          ease: "power2.out",
        });
      }

      const navChildren = navRef.current ? Array.from(navRef.current.children) : [];
      if (navChildren.length) {
        gsap.from(navChildren, {
          opacity: 0,
          y: -80,
          duration: 0.8,
          stagger: 0.1,
          ease: "bounce.out",
          delay: 0.3,
        });
      }

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          opacity: 0,
          x: -30,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.6,
        });
      }

      const wordsToAnimate = wordRefs.current.filter(Boolean);
      if (wordsToAnimate.length) {
        gsap.from(wordsToAnimate, {
          opacity: 0,
          y: 12,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.9,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const words = BLOCKQUOTE_TEXT.split(/\s+/);

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <Box py="0"
             style={{backgroundColor: "gray", justifyContent: "center", items: "center", justifyItems: "center"}}>
            <Heading as="h3" ref={headingRef}>
              About Me
            </Heading>
      </Box>

      {/* Nav: Home left, other icons right */}
      <div style={{ backgroundColor: "gray", px:-4}}>
          <Flex
            justifyItems="center"
            items="center"
            ref={navRef}
            justify="between"
            wrap="wrap"
            className="w-full "
          >
            <div>
            <Link
              href="/"
              aria-label="Home"
              className="shrink-0 transition-opacity hover:opacity-80 [&_svg]:text-white"
            >
              <HomeIcon />
            </Link>
            </div>
            <div className="flex gap-5">
              <span>
              <a
                href="https://github.com/PMatrixMedia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/Images/github.png"
                  alt="GitHub"
                  width={38}
                  height={38}
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </a>
              </span>
              <span>
              <a
                href="https://www.linkedin.com/in/christopher-faison-1b7b6948"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/Images/linkedin.png"
                  alt="LinkedIn"
                  width={90}
                  height={38}
                />
              </a>
              </span>
              <span>
              <a
                href="https://codesandbox.io/u/PMatrixMedia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CodeSandbox"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/Images/codesandbox-logo.png"
                  alt="CodeSandbox"
                  width={187}
                  height={50}
                />
              </a>
              </span>
            </div>
        </Flex>
      </div>

      {/* Avatar card right above the paragraph */}
      <Box className="bg-black pt-6 pl-10 ml-8" width="829" height="200px" >
          <Flex justify="left" ml="24%"className="pl-10">
            <Card ref={cardRef} className="max-w-fit">
              <Flex align="center" justify="center" gap="4">
                <Avatar
                  src={avatarImg.src}
                  alt="Profile"
                  size="9"
                  fallback="?"
                  radius="full"
                  className="border-2 border-white/20"
                />
                <Box>
                  <Text size="6"><Strong>Your WebMaster</Strong></Text>
                </Box>
              </Flex>
            </Card>
          </Flex>
      </Box>

      {/* Main content - first paragraph */}
      <Box className="relative bg-black py-8 px-6 min-h-[50vh] sm:px-8">
        <Flex justify="center">
          <Container size="3" className="max-w-[1000px]">
            <Blockquote ref={blockquoteRef} size="7">
              {words.map((word, i) => (
                <span
                  key={i}
                  ref={(el) => (wordRefs.current[i] = el)}
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              ))}
            </Blockquote>
          </Container>
        </Flex>
      </Box>
    </Theme>
  );
};

