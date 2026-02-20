import React from "react";
import Link from "next/link";
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
  return (
    <Theme
      appearance="dark"
      accentColor="gray"
      grayColor="slate"
      radius="medium"
    >
     <Box py="4"
     style={{backgroundColor: "gray"}}> 
        <Flex gap="3" align="center" wrap="wrap" className="sm:gap-6 px-4 sm:px-6">
          <NavButton href="/" icon={HomeIcon}>
            <Text size="6"><Strong>Home</Strong></Text>
          </NavButton>
          <NavButton href="/blog" icon={FileTextIcon}>
            <Text size="6"><Strong>Blog</Strong></Text>
          </NavButton>
          <NavButton href="/features" icon={GearIcon}>
            <Text size="6"><Strong>Features</Strong></Text>
          </NavButton>
          <NavButton href="/contact" icon={EnvelopeClosedIcon}>
            <Text size="6"><Strong>Contact</Strong></Text>
          </NavButton>
        </Flex>
        </Box>
        <Box align="left" justify="left">
        <Section size="2"/>
          <Container>
          <Flex direction="column" align="start" gap="4">
            <Avatar
              src={avatarImg.src}
              alt="Profile"
              size="5"
              fallback="?"
              radius="full"
            />
          <Blockquote size="8" color="orange">
            Quick Update: I have redesigned my page to make the navigation more
            intuative and to be mobile friendly. Look forward to more updates
            moving forward and in the future.  Also redid the blog section.
          </Blockquote>
          </Flex>
          </Container>
          </Box>
    </Theme>
  );
}
