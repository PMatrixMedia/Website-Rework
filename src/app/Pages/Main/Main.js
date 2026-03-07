"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  HomeIcon,
  FileTextIcon,
  GearIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { Theme, Button, Strong, Box, Text, Container, Section, Flex, Blockquote, Avatar } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import avatarImg from "../About/avatar(2).jpg";

const iconProps = { width: 24, height: 24 };

const BLOCKQUOTE_TEXT =
  "Quick Update: I have redesigned my page to make the navigation more intuative and to be mobile friendly. Look forward to more updates moving forward and in the future.  Also redid the blog section.";

function NavButton({ href, icon: Icon, children }) {
  return (
    <Button variant="ghost" size="2" asChild className="text-white hover:bg-slate-900 hover:text-white">
      <Link
        href={href}
        className="flex items-center gap-2 px-4 py-2 transition-all duration-200 ease-out hover:scale-110"
      >
        {Icon && <Icon {...iconProps} />}
        {children}
      </Link>
    </Button>
  );
}

export default function PhaseMain() {
  const navRef = useRef(null);
  const avatarRef = useRef(null);
  const blockquoteRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll(".nav-item");
    gsap.fromTo(
      items,
      { opacity: 0, x: 80 },
      { opacity: 1, x: 0, duration: 0.5, stagger: -0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!avatarRef.current) return;
    gsap.fromTo(
      avatarRef.current,
      { opacity: 0, rotation: 720 },
      { opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!blockquoteRef.current) return;
    const words = blockquoteRef.current.querySelectorAll(".blockquote-word");
    gsap.fromTo(
      words,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
    );
  }, []);

  const words = BLOCKQUOTE_TEXT.split(/\s+/);

  return (
    <Theme
      appearance="dark"
      accentColor="gray"
      grayColor="slate"
      radius="medium"
    >
     <Box py="4"
     style={{backgroundColor: "gray"}}> 
        <Flex ref={navRef} gap="3" align="center" wrap="wrap" className="sm:gap-6 px-4 sm:px-6">
          <span className="nav-item">
            <NavButton href="/" icon={HomeIcon}>
              <Text size="6"><Strong>Home</Strong></Text>
            </NavButton>
          </span>
          <span className="nav-item">
            <NavButton href="/blog" icon={FileTextIcon}>
              <Text size="6"><Strong>Blog</Strong></Text>
            </NavButton>
          </span>
          <span className="nav-item">
            <NavButton href="/features" icon={GearIcon}>
              <Text size="6"><Strong>Features</Strong></Text>
            </NavButton>
          </span>
          <span className="nav-item">
            <NavButton href="/contact" icon={EnvelopeClosedIcon}>
              <Text size="6"><Strong>Contact</Strong></Text>
            </NavButton>
          </span>
        </Flex>
        </Box>
        <Box align="left" justify="left">
        <Section size="2"/>
          <Container>
          <Flex direction="column" align="start" gap="4">
            <Box ref={avatarRef}>
              <Avatar
                src={avatarImg.src}
                alt="Profile"
                size="5"
                fallback="?"
                radius="full"
              />
            </Box>
          <div ref={blockquoteRef}>
            <Blockquote size="8" color="orange">
              {words.map((word, i) => (
                <span key={i} className="blockquote-word inline">
                  {word}{" "}
                </span>
              ))}
            </Blockquote>
          </div>
          </Flex>
          </Container>
          </Box>
    </Theme>
  );
}
