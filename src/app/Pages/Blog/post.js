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
import { PhaseNavBar } from "@/app/Components/Nav/PhaseNavBar";
import {
  HomeIcon,
  FileTextIcon,
  GearIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";

const iconProps = { width: 22, height: 22 };

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
      const apiUrl = `${window.location.origin}/api/blog`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "New Update",
          excerpt: content.slice(0, 120),
          content,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(res.ok ? "Invalid response from server" : `Server error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save post");
      }

      if (data?.success) {
        setModalError(null);
        setShowModal(true);
        setContent("");
        setTitle("");
      } else {
        setModalError("Failed to save post");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      const message =
        err.name === "AbortError"
          ? "Request timed out. Please try again."
          : err.message || "Failed to save post";
      setModalError(message);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="medium">
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="blog-page-nav">
          <PhaseNavBar
            labelTextSize="5"
            items={[
              { key: "home", href: "/", label: "Home", Icon: HomeIcon },
              { key: "blog", href: "/blog", label: "Blog", Icon: FileTextIcon },
              { key: "features", href: "/features", label: "Features", Icon: GearIcon },
              { key: "contact", href: "/contact", label: "Contact", Icon: EnvelopeClosedIcon },
            ]}
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
          <Link
            href="/blog"
            className="text-sm flex items-center gap-2 mb-6 text-orange-400/90 hover:text-orange-300 transition-colors"
          >
            <FileTextIcon {...iconProps} />
            ← Back to Blog
          </Link>

          <Heading size="8" weight="bold" className="mb-6">
            New Blog Entry
          </Heading>

          <Card size="3" className="p-8 min-h-[420px] border border-white/10 bg-slate-900/80 shadow-lg">
            <Flex direction="column" gap="4">
              <Box>
                <Text as="label" size="2" weight="medium" className="block mb-2 text-slate-300">
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
                <Text as="label" size="2" weight="medium" className="block mb-2 text-slate-300">
                  Content
                </Text>
                <textarea
                  placeholder="Write your update here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[320px] px-3 py-3 rounded-md bg-slate-950/80 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-y"
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
