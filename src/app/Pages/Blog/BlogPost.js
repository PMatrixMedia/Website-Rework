import React from "react";
import Link from "next/link";
import { Theme, Badge, Text, Heading, Box, Flex, Avatar } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="medium">
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <Box className="text-center">
            <Heading size="6" className="mb-4">
              Post not found
            </Heading>
            <Link href="/blog" className="text-orange-400 opacity-90 hover:opacity-100">
              ← Back to Blog
            </Link>
          </Box>
        </div>
      </Theme>
    );
  }

  return (
    <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="medium">
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Link
            href="/blog"
            className="text-sm mb-6 block text-orange-400/90 hover:text-orange-300 transition-colors"
          >
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

          <Heading size="8" weight="bold" className="mb-4">
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
            className="max-w-none leading-relaxed text-slate-200 [&_a]:text-orange-400 [&_a]:underline-offset-2 hover:[&_a]:text-orange-300 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-slate-50"
            dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, "<br />") || post.excerpt }}
          />
        </article>
      </div>
    </Theme>
  );
}
