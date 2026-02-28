"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
    <Box className="aspect-[2/1] bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
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

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Box className="bg-slate-800 px-4 py-3 sm:px-6 sm:py-4">
          <Flex gap="6" align="center" wrap="wrap">
            <Button variant="ghost" size="2" asChild>
              <Link href="/" className="flex items-center gap-2 text-white hover:text-white">
                <HomeIcon {...iconProps} />
                <Text>Home</Text>
              </Link>
            </Button>
            <Button variant="ghost" size="2" asChild>
              <Link href="/blog" className="flex items-center gap-2 text-white hover:text-white">
                <FileTextIcon {...iconProps} />
                <Text>Blog</Text>
              </Link>
            </Button>
            <Button variant="ghost" size="2" asChild>
              <Link href="/features" className="flex items-center gap-2 text-white hover:text-white">
                <GearIcon {...iconProps} />
                <Text>Features</Text>
              </Link>
            </Button>
            <Button variant="ghost" size="2" asChild>
              <Link href="/contact" className="flex items-center gap-2 text-white hover:text-white">
                <EnvelopeClosedIcon {...iconProps} />
                <Text>Contact</Text>
              </Link>
            </Button>
          </Flex>
        </Box>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-16">
          <Flex direction="column" gap="6" mb="8">
            <Link href="/main" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
              <HomeIcon {...iconProps} />
              ← Back to Main
            </Link>
            <Box>
              <Heading size="8" weight="bold" className="text-white">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="block">
                <BlogCard post={post} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Theme>
  );
}
