"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Theme, Card, Badge, Text, Heading, Box, Flex, Avatar, Button, Separator } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

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

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch {
        setPosts([
          {
            id: 1,
            title: "Welcome to PhaseMatrix Media Blog",
            excerpt: "Updates and insights from our team. Stay tuned for the latest news, tutorials, and behind-the-scenes content.",
            date: "Feb 13, 2025",
            tags: ["welcome", "updates"],
            author: { name: "PhaseMatrix", avatar: null },
          },
          {
            id: 2,
            title: "Website Redesign in Progress",
            excerpt: "We're rebuilding our site with a fresh look, improved navigation, and mobile-friendly design. Expect more updates soon.",
            date: "Feb 12, 2025",
            tags: ["design", "news"],
            author: { name: "PhaseMatrix", avatar: null },
          },
          {
            id: 3,
            title: "New Features Coming Soon",
            excerpt: "Explore what we have in store for the future. New features, integrations, and improvements are on the roadmap.",
            date: "Feb 10, 2025",
            tags: ["features", "roadmap"],
            author: { name: "PhaseMatrix", avatar: null },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Flex direction="column" gap="6" mb="8">
            <Link href="/main" className="text-slate-400 hover:text-white transition-colors text-sm">
              ← Back to Main
            </Link>
            <Heading size="8" weight="bold" className="text-white">
              Blog & Updates
            </Heading>
            <Text size="3" color="gray">
              Latest news, tutorials, and insights from PhaseMatrix Media.
            </Text>
            <Separator size="4" />
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" className="py-24">
              <div className="animate-pulse flex flex-col gap-4 w-full max-w-md">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
                <div className="h-32 bg-slate-700 rounded" />
              </div>
            </Flex>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block">
                  <BlogCard post={post} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Theme>
  );
}
