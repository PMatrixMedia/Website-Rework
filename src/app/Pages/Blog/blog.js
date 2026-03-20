"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  HomeIcon,
  FileTextIcon,
  GearIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { Theme, Card, Badge, Text, Heading, Box, Flex, Avatar, Button, Separator, Select } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import avatarImg from "../About/avatar(2).jpg";

const iconProps = { width: 24, height: 24 };

const BlogCard = ({ post }) => (
  <Card size="2" className="overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-500/10 hover:-translate-y-0.5">
    <Box className="aspect-2/1 bg-linear-to-br from-slate-700 to-slate-900 overflow-hidden">
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-6xl text-slate-600">📝</span>
        </div>
      )}
    </Box>
    <Box p="4">
      <Flex gap="2" mb="2" wrap="wrap">
        {post.tags?.map((tag) => (
          <Badge key={tag} size="1" variant="soft" color="gray">
            {tag}
          </Badge>
        ))}
      </Flex>
      <Heading size="4" className="mb-2 line-clamp-2">
        {post.title}
      </Heading>
      <Text size="2" color="gray" className="line-clamp-2 mb-4">
        {post.excerpt}
      </Text>
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Avatar
            size="1"
            src={post.author?.avatar}
            fallback={post.author?.name?.[0] || "?"}
            radius="full"
          />
          <Text size="1" color="gray">{post.author?.name || "Anonymous"}</Text>
        </Flex>
        <Text size="1" color="gray">{post.date}</Text>
      </Flex>
    </Box>
  </Card>
);

function addAvatarToPosts(posts) {
  return posts.map((p) => ({
    ...p,
    author: {
      ...p.author,
      avatar: p.author?.avatar || avatarImg?.src,
    },
  }));
}

function parseDate(post) {
  const d = post.date;
  if (!d) return 0;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export default function Blog({ posts = [] }) {
  const [sortOrder, setSortOrder] = useState("newest");
  const gridRef = useRef(null);
  const navRef = useRef(null);
  const postsWithAvatar = addAvatarToPosts(posts);

  const sortedPosts = useMemo(() => {
    const copy = [...postsWithAvatar];
    copy.sort((a, b) => {
      const timeA = parseDate(a);
      const timeB = parseDate(b);
      if (sortOrder === "oldest") return timeA - timeB;
      return timeB - timeA;
    });
    return copy;
  }, [postsWithAvatar, sortOrder]);

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll(".nav-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!gridRef.current || sortedPosts.length === 0) return;
    const cards = gridRef.current.querySelectorAll(".blog-post-card");
    const n = cards.length;
    const cols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const stagger = n > 1 ? (2 - 0.55) / (n - 1) : 0;
    cards.forEach((card, i) => {
      const col = i % cols;
      const x = cols === 1 ? 0 : col === 0 ? -60 : col === cols - 1 ? 60 : 0;
      gsap.fromTo(
        card,
        { opacity: 0, x, y: 50 },
        { opacity: 1, x: 0, y: 0, duration: 0.55, delay: i * stagger, ease: "power2.out" }
      );
    });
  }, [sortedPosts]);

  return (
    <Theme appearance="inherit" accentColor="gray" grayColor="slate">
      <div className="min-h-screen bg-(--background) text-(--foreground)">
        <Box className="border-b border-black/10 bg-black/5 px-4 py-3 dark:border-white/10 dark:bg-white/5 sm:px-6 sm:py-4">
          <Flex ref={navRef} gap="6" align="center" wrap="wrap">
            <span className="nav-item">
              <Button variant="ghost" size="2" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <HomeIcon {...iconProps} />
                  <Text>Home</Text>
                </Link>
              </Button>
            </span>
            <span className="nav-item">
              <Button variant="ghost" size="2" asChild>
                <Link href="/blog" className="flex items-center gap-2">
                  <FileTextIcon {...iconProps} />
                  <Text>Blog</Text>
                </Link>
              </Button>
            </span>
            <span className="nav-item">
              <Button variant="ghost" size="2" asChild>
                <Link href="/features" className="flex items-center gap-2">
                  <GearIcon {...iconProps} />
                  <Text>Features</Text>
                </Link>
              </Button>
            </span>
            <span className="nav-item">
              <Button variant="ghost" size="2" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  <EnvelopeClosedIcon {...iconProps} />
                  <Text>Contact</Text>
                </Link>
              </Button>
            </span>
          </Flex>
        </Box>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-16">
          <Flex direction="column" gap="6" mb="8">
            <Link href="/main" className="text-sm flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <HomeIcon {...iconProps} />
              ← Back to Main
            </Link>
            <Box>
              <Heading size="8" weight="bold">
                Blog & Updates
              </Heading>
              <Text size="3" color="gray">
                Latest news, tutorials, and insights from PhaseMatrix Media.
              </Text>
            </Box>
            <Separator size="4" />
          </Flex>

          <Flex justify="between" align="center" mb="4" wrap="wrap" gap="3">
            <Text size="2" color="gray">Sort by date:</Text>
            <Select.Root value={sortOrder} onValueChange={setSortOrder}>
              <Select.Trigger placeholder="Sort" />
              <Select.Content>
                <Select.Item value="newest">Newest first</Select.Item>
                <Select.Item value="oldest">Oldest first</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block blog-post-card"
              >
                <BlogCard post={post} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Theme>
  );
}
