"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeClosedIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { Box, Button, Container, Flex, Heading, Text } from "@radix-ui/themes";

const iconProps = { width: 20, height: 20 };

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/main", label: "Main", Icon: HomeIcon },
  { href: "/about", label: "About", Icon: FileTextIcon },
  { href: "/features", label: "Features", Icon: GearIcon },
  { href: "/contact", label: "Contact", Icon: EnvelopeClosedIcon },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/PMatrixMedia",
    label: "GitHub",
    imageSrc: "/Images/github.png",
    width: 24,
    height: 24,
    invert: true,
  },
  {
    href: "https://www.linkedin.com/in/christopher-faison-1b7b6948",
    label: "LinkedIn",
    imageSrc: "/Images/Linkedin.png",
    width: 24,
    height: 24,
  },
  {
    href: "https://codesandbox.io/u/PMatrixMedia",
    label: "CodeSandbox",
    imageSrc: "/Images/codesandbox-logo.png",
    width: 92,
    height: 24,
  },
];

export function SiteHeader({ currentPath, eyebrow = "PhaseMatrix Media" }) {
  return (
    <Box className="sticky top-0 z-30 border-b border-white/10 bg-black/35 backdrop-blur-xl">
      <Container size="4" className="px-4 py-4 sm:px-6">
        <Flex align="center" justify="between" gap="4" wrap="wrap">
          <Flex direction="column" gap="1">
            <Text size="1" className="uppercase tracking-[0.28em] text-orange-300/80">
              {eyebrow}
            </Text>
            <Heading size="4" className="font-[var(--font-geist-sans)] text-white">
              PhaseMatrix Media
            </Heading>
          </Flex>

          <Flex gap="2" wrap="wrap">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = currentPath === href;
              return (
                <Button
                  key={href}
                  variant={active ? "solid" : "ghost"}
                  color={active ? "orange" : "gray"}
                  size="2"
                  highContrast={active}
                  asChild
                >
                  <Link href={href} className="flex items-center gap-2">
                    <Icon {...iconProps} />
                    <Text>{label}</Text>
                  </Link>
                </Button>
              );
            })}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export function SocialLinks() {
  return (
    <Flex gap="3" wrap="wrap">
      {SOCIAL_LINKS.map(({ href, label, imageSrc, width, height, invert }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-white/10"
        >
          <Image
            src={imageSrc}
            alt={label}
            width={width}
            height={height}
            className={invert ? "brightness-0 invert" : ""}
          />
        </a>
      ))}
    </Flex>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "left",
}) {
  return (
    <Flex
      direction="column"
      gap="4"
      className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      {eyebrow ? (
        <Text size="2" className="uppercase tracking-[0.3em] text-orange-300/80">
          {eyebrow}
        </Text>
      ) : null}
      <Heading
        size="9"
        className="font-[var(--font-geist-sans)] text-balance text-white"
      >
        {title}
      </Heading>
      {description ? (
        <Text size="4" className="text-pretty text-slate-300">
          {description}
        </Text>
      ) : null}
      {children}
    </Flex>
  );
}

export function Surface({ children, className = "" }) {
  return (
    <Box
      className={`rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`.trim()}
    >
      {children}
    </Box>
  );
}
