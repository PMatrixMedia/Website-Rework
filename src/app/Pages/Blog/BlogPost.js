"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Theme, Card, Badge, Text, Heading, Box, Flex, Avatar } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function BlogPost({ postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${postId}`
        );
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          setPost(null);
        }
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading...</div>
        </div>
      </Theme>
    );
  }

  if (!post) {
    return (
      <Theme appearance="dark" accentColor="gray" grayColor="slate">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <Box className="text-center">
            <Heading size="6" className="text-white mb-4">Post not found</Heading>
            <Link href="/blog" className="text-slate-400 hover:text-white">
              ← Back to Blog
            </Link>
          </Box>
        </div>
      </Theme>
    );
  }

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm mb-6 block">
            ← Back to Blog
          </Link>

          {post.image && (
            <Box className="mb-6 rounded-lg overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
            </Box>
          )}

          <Flex gap="2" mb="4" wrap="wrap">
            {post.tags?.map((tag) => (
              <Badge key={tag} size="1" variant="soft" color="gray">
                {tag}
              </Badge>
            ))}
          </Flex>

          <Heading size="8" weight="bold" className="text-white mb-4">
            {post.title}
          </Heading>

          <Flex align="center" gap="2" mb="6">
            <Avatar
              size="1"
              src={post.author?.avatar}
              fallback={post.author?.name?.[0] || "?"}
              radius="full"
            />
            <Text size="2" color="gray">{post.author?.name}</Text>
            <Text size="1" color="gray">•</Text>
            <Text size="1" color="gray">{post.date}</Text>
          </Flex>

          <div
            className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, "<br />") || post.excerpt }}
          />
        </article>
      </div>
    </Theme>
  );
}
