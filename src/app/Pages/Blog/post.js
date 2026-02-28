"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Theme,
  Box,
  Card,
  Text,
  Heading,
  Button,
  Flex,
  Dialog,
  TextField,
} from "@radix-ui/themes";
import {
  HomeIcon,
  FileTextIcon,
  GearIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";

const iconProps = { width: 24, height: 24 };

export default function Post() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModalOpenChange = (open) => {
    setShowModal(open);
    if (!open) {
      setModalError(null);
      router.refresh();
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "New Update",
          excerpt: content.slice(0, 120),
          content,
        }),
      });
      if (res.ok) {
        setModalError(null);
        setShowModal(true);
        setContent("");
        setTitle("");
      } else {
        const data = await res.json().catch(() => ({}));
        setModalError(data.error || "Failed to save post");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setModalError(err.message || "Failed to save post");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
          <Link
            href="/blog"
            className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 mb-6"
          >
            <FileTextIcon {...iconProps} />
            ← Back to Blog
          </Link>

          <Heading size="8" weight="bold" className="text-white mb-6">
            New Blog Entry
          </Heading>

          <Card size="3" className="p-8 min-h-[420px]">
            <Flex direction="column" gap="4">
              <Box>
                <Text as="label" size="2" weight="medium" className="text-slate-300 block mb-2">
                  Title
                </Text>
                <TextField.Root
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="3"
                  className="w-full"
                />
              </Box>
              <Box>
                <Text as="label" size="2" weight="medium" className="text-slate-300 block mb-2">
                  Content
                </Text>
                <textarea
                  placeholder="Write your update here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[320px] px-3 py-3 rounded-md bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-y"
                  rows={14}
                />
              </Box>
              <Flex justify="end" align="center" className="pt-2">
                <Button
                  size="3"
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
      </div>

      <Dialog.Root open={showModal} onOpenChange={handleModalOpenChange}>
        <Dialog.Content size="2" maxWidth="360px">
          <Dialog.Title>{modalError ? "Error" : "Update received"}</Dialog.Title>
          <Text size="2" color={modalError ? "red" : "gray"} as="p" mt="2">
            {modalError || "Your post has been added to the blog."}
          </Text>
          <Flex gap="3" mt="4" justify="end" wrap="wrap">
            {!modalError && (
              <Button size="2" asChild>
                <Link href="/blog">View on Blog</Link>
              </Button>
            )}
            <Dialog.Close>
              <Button variant="soft" size="2">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Theme>
  );
}
