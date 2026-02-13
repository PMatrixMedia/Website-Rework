"use client";

import React from "react";
import Link from "next/link";
import { Theme, Button, Strong, Box,Text, Container, Section,Grid} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const HomeIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BlogIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const FeaturesIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

function NavButton({ href, icon: Icon, children }) {
  return (
    <Button variant="ghost" size="2" asChild className="text-white hover:bg-slate-900 hover:text-white">
      <Link
        href={href}
        className="flex items-center gap-2 px-4 py-2 transition-all duration-200 ease-out hover:scale-110"
      >
        {Icon && <Icon />}
        {children}
      </Link>
    </Button>
  );
}

export default function PhaseMain() {
  return (
    <Theme
      appearance="dark"
      accentColor="gray"
      grayColor="slate"
      radius="medium"
    >
     <Box py="4"
     style={{backgroundColor: "gray"}}> 
        <Grid columns="4" width="35%">
          <Box width="30px" height="43px">
          <NavButton href="/" icon={HomeIcon}>
          <Text size="6"><Strong>Home</Strong></Text>
          </NavButton>
          </Box>
          <Box width="30px" height="30px">
          <NavButton href="/blog" icon={BlogIcon}>
          <Text size="6"><Strong>Blog</Strong></Text>
          </NavButton>
          </Box>
          <Box width="30px" height="30px">
          <NavButton href="/features" icon={FeaturesIcon}>
          <Text size="6"><Strong>Features</Strong></Text>
          </NavButton>
          </Box>
          <Box gap="3" width="45px" height="30px">
          <NavButton href="/contact">
          <Text size="7"><Strong>Contact</Strong></Text>
          </NavButton>
          </Box>
        </Grid>
        </Box>
        <Box align="left" justify="left">
        <Section size="2"/>
          <Container>
          <Text size="8" color="white">
            Quick Update: I have redesigned my page to make the navigation more
            intuative and to be mobile friendly. Look forward to more updates
            moving forward and in the future.
          </Text>
          </Container>
          </Box>
    </Theme>
  );
}
