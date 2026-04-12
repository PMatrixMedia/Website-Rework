"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { HomeIcon } from "@radix-ui/react-icons";
import { PhaseNavBar, PhaseNavLink } from "@/app/Components/Nav/PhaseNavBar";
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

const LinkedInIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="shrink-0 text-white/85"
  >
    <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

/** Inline mark like LinkedInIcon — no static image URL; hover scale targets `svg` in globals */
const CodeSandboxIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinejoin="round"
    strokeLinecap="round"
    aria-hidden="true"
    className="shrink-0 text-white/85"
  >
    <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M4 7.5 12 12l8-4.5M12 12v9" />
  </svg>
);

const socialLinkClass = "phase-nav-social-anchor";

export default function About() {
  const headingRef = useRef(null);
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
      <div className="about-page-nav sticky top-0 z-30 border-b border-white/10 bg-black/18 shadow-[0_0_42px_-14px_rgba(249,115,22,0.18)] backdrop-blur-xl">
        <div className="border-b border-white/10 px-[1.125rem] py-2 sm:px-[1.6875rem]">
          <Heading as="h3" ref={headingRef} size="4" className="text-center text-white">
            About Me
          </Heading>
        </div>
        <PhaseNavBar
          className="!static rounded-none border-0 shadow-none"
          justify="between"
          leading={
            <PhaseNavLink href="/" Icon={HomeIcon} iconOnly aria-label="Home" />
          }
          trailing={
            <div className="ml-auto flex flex-wrap items-center gap-4 sm:gap-5">
              <span data-phase-nav-item className="phase-nav-item-wrap">
                <a
                  href="https://github.com/PMatrixMedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={socialLinkClass}
                >
                  <Image
                    src="/images/github.png"
                    alt=""
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                </a>
              </span>
              <span data-phase-nav-item className="phase-nav-item-wrap">
                <a
                  href="https://www.linkedin.com/in/christopher-faison-1b7b6948"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={socialLinkClass}
                >
                  <LinkedInIcon />
                </a>
              </span>
              <span data-phase-nav-item className="phase-nav-item-wrap">
                <a
                  href="https://codesandbox.io/u/PMatrixMedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CodeSandbox"
                  className={socialLinkClass}
                >
                  <CodeSandboxIcon />
                </a>
              </span>
            </div>
          }
        />
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
      <div className="relative bg-black py-8 px-6 min-h-[50vh] sm:px-8">
        <Flex justify="center">
          <Container size="3" className="max-w-[1000px]">
            <Blockquote ref={blockquoteRef} size="7" className="electrolize-regular">
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
      </div>
    </Theme>
  );
};
