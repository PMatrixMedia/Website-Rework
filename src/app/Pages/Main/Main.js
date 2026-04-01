"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
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
  const router = useRouter();
  const navRef = useRef(null);
  const avatarRef = useRef(null);
  const blockquoteRef = useRef(null);
  const [wcOpen, setWcOpen] = useState(false);
  const [wcRoom, setWcRoom] = useState("demo-room");
  const [wcName, setWcName] = useState("");

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
      radius="medium"
    >
     <Box py="4"
     style={{backgroundColor: "gray"}}> 
        <Flex ref={navRef} gap="5" align="center" wrap="wrap" className="sm:gap-6 px-4 sm:px-6">
          <div className="nav-item hover:scale-120">
            <NavButton href="/" icon={HomeIcon}>
              <Text size="6"><Strong>Home</Strong></Text>
            </NavButton>
          </div>
          <div className="nav-item hover:scale-120">
            <NavButton href="/blog" icon={FileTextIcon}>
              <Text size="6"><Strong>Blog</Strong></Text>
            </NavButton>
          </div>
          <div className="nav-item hover:scale-120 relative group">
            <NavButton href="/features" icon={GearIcon}>
              <Text size="6"><Strong>Features</Strong></Text>
            </NavButton>
            <div
              className="absolute left-0 top-full z-50 pt-1 min-w-[200px] opacity-0 invisible pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto"
              role="navigation"
              aria-label="Features submenu"
            >
              <div className="rounded-md border border-white/20 bg-gray-500/75 p-1 shadow-lg backdrop-blur-m flex flex-col gap-0.5">
                <Button variant="ghost" size="3" asChild className="w-full justify-start ml-1 text-white hover:bg-gray-600">
                  <Link
                    href="/mapping"
                    className="flex items-center gap-2 px-4 py-2 transition-all duration-200 ease-out hover:scale-[1.02]"
                  >
                    <GlobeIcon {...iconProps} />
                    <Text size="4">
                      <Strong>GlobalMapping</Strong>
                    </Text>
                  </Link>
                </Button>
                <Dialog.Root open={wcOpen} onOpenChange={setWcOpen}>
                  <Dialog.Trigger>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-gray-600"
                    >
                      <VideoIcon {...iconProps} />
                      <Text size="4">
                        <Strong>WebConferencing</Strong>
                      </Text>
                    </button>
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
          <div className="nav-item hover:scale-120">
            <NavButton href="/contact" icon={EnvelopeClosedIcon}>
              <Text size="6"><Strong>Contact</Strong></Text>
            </NavButton>
          </div>
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
