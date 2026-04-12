"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { PhaseNavBar, PhaseNavLink } from "@/app/Components/Nav/PhaseNavBar";
import {
  HomeIcon,
  FileTextIcon,
  GearIcon,
  EnvelopeClosedIcon,
  GlobeIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import {
  Theme,
  Button,
  Strong,
  Box,
  Text,
  Container,
  Section,
  Flex,
  Blockquote,
  Avatar,
  Dialog,
  TextField,
  Separator,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import avatarImg from "../About/avatar(2).jpg";
import LetterGlitch from "@/app/Components/Intro/LetterGlitch";

const iconProps = { width: 30, height: 30, className: "phase-nav-icon" };

const BLOCKQUOTE_TEXT =
  "Quick Update: I have redesigned my page to make the navigation more intuative and to be mobile friendly.Check out the Blog section to find out what's new.";

export default function PhaseMain() {
  const router = useRouter();
  const avatarRef = useRef(null);
  const blockquoteRef = useRef(null);
  const [wcOpen, setWcOpen] = useState(false);
  const [wcRoom, setWcRoom] = useState("demo-room");
  const [wcName, setWcName] = useState("");

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

  const mainNavItems = [
    {
      key: "home",
      href: "/",
      Icon: HomeIcon,
      label: (
        <Text size="5">
          <Strong>Home</Strong>
        </Text>
      ),
    },
    {
      key: "blog",
      href: "/blog",
      Icon: FileTextIcon,
      label: (
        <Text size="5">
          <Strong>Blog</Strong>
        </Text>
      ),
    },
    {
      key: "features",
      custom: (
        <div className="relative group">
          <PhaseNavLink href="/features" Icon={GearIcon}>
            <Text size="5">
              <Strong>Features</Strong>
            </Text>
          </PhaseNavLink>
          <div
            className="pointer-events-none invisible absolute left-0 top-full z-50 min-w-[300px] pt-1 opacity-50% transition-opacity duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100"
            role="navigation"
            aria-label="Features submenu"
          >
            <div className="flex flex-col gap-0.5 rounded-md border border-white/20 bg-gray-500/75 p-1.5 shadow-lg backdrop-blur-md">
              <Button variant="ghost" size="4" asChild className="phase-nav-button-root w-full justify-start">
                <Link
                  href="/mapping"
                  className="phase-nav-link flex w-full items-center gap-3 px-6 py-4"
                >
                  <GlobeIcon {...iconProps} />
                  <Text size="4">
                    <Strong>GlobalMapping</Strong>
                  </Text>
                </Link>
              </Button>
              <Dialog.Root open={wcOpen} onOpenChange={setWcOpen}>
                <Dialog.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="4"
                    asChild
                    className="phase-nav-button-root w-full justify-start"
                  >
                    <button
                      type="button"
                      className="phase-nav-link flex w-full items-center gap-3 px-6 py-4 text-left"
                    >
                      <VideoIcon {...iconProps} />
                      <Text size="5">
                        <Strong>WebConferencing</Strong>
                      </Text>
                    </button>
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content style={{ maxWidth: 420 }}>
                  <Dialog.Title>Web conferencing</Dialog.Title>
                  <Dialog.Description size="2" mb="3" color="gray">
                    Enter a room name and your display name, then join. You will be taken to the
                    call screen with these settings.
                  </Dialog.Description>
                  <Flex direction="column" gap="3">
                    <label htmlFor="wc-modal-room">
                      <Text size="2" weight="bold" mb="1" as="div">
                        Room name
                      </Text>
                      <TextField.Root
                        id="wc-modal-room"
                        size="3"
                        value={wcRoom}
                        onChange={(e) => setWcRoom(e.target.value)}
                        placeholder="e.g. demo-room"
                        autoComplete="off"
                      />
                    </label>
                    <label htmlFor="wc-modal-name">
                      <Text size="2" weight="bold" mb="1" as="div">
                        Display name
                      </Text>
                      <TextField.Root
                        id="wc-modal-name"
                        size="3"
                        value={wcName}
                        onChange={(e) => setWcName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </label>
                  </Flex>
                  <Separator size="4" my="4" />
                  <Flex justify="end" gap="3">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button type="button" onClick={handleWebConferencingJoin} highContrast>
                      <Strong>Join</Strong>
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      href: "/contact",
      Icon: EnvelopeClosedIcon,
      label: (
        <Text size="6">
          <Strong>Contact</Strong>
        </Text>
      ),
    },
  ];

  function handleWebConferencingJoin() {
    const room = wcRoom.trim() || "demo-room";
    const name = wcName.trim() || "Guest";
    const q = new URLSearchParams({ room, name });
    setWcOpen(false);
    router.push(`/webconferencing?${q.toString()}`);
  }

  return (
    <Theme
      appearance="dark"
      accentColor="gray"
      grayColor="slate"
      radius="small"
    >
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
          <PhaseNavBar items={mainNavItems} />
          <Box align="left" justify="left">
            <Section size={{ base: "4", lg: "4" }} />
            <Container>
              <Flex direction="column" align="start" gap="4">
                <Box
                  ref={avatarRef}
                  className="inline-flex rounded-full bg-black p-2"
                >
                  <Avatar
                    src={avatarImg.src}
                    alt="Profile"
                    size="7"
                    fallback="?"
                    radius="full"
                  />
                </Box>
                <div ref={blockquoteRef} className="w-full max-w-full rounded-md bg-black px-3 py-2">
                  <Blockquote size="8" color="orange" className="electrolize-regular">
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
        </Box>
      </Box>
    </Theme>
  );
}
