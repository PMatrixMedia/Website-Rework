import React from "react";
import Link from "next/link";
import { Theme, Badge, Text, Heading, Box, Flex, Avatar } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <Theme appearance="inherit" accentColor="gray" grayColor="slate">
        <div className="min-h-screen bg-(--background) text-(--foreground) flex items-center justify-center">
          <Box className="text-center">
            <Heading size="6" className="mb-4">Post not found</Heading>
            <Link href="/blog" className="opacity-70 hover:opacity-100">
              ← Back to Blog
            </Link>
          </Box>
        </div>
      </Theme>
    );
  }

  return (
    <Theme appearance="inherit" accentColor="gray" grayColor="slate">
      <div className="min-h-screen bg-(--background) text-(--foreground)">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/blog" className="text-sm mb-6 block opacity-70 hover:opacity-100 transition-opacity">
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
            className="prose max-w-none leading-relaxed dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, "<br />") || post.excerpt }}
          />
        </article>
      </div>
    </Theme>
  );
}
