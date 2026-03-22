"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Theme,
  Box,
  Flex,
  Container,
  Text,
  Heading,
  Card,
  Button,
  TextField,
  Dialog,
} from "@radix-ui/themes";
import { HomeIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";

const iconProps = { width: 24, height: 24 };

export default function Contact() {
  const contactRootRef = useRef(null);

  useLayoutEffect(() => {
    const root = contactRootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray(
        root.querySelectorAll("[data-contact-anim]"),
      );
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          {
            opacity: 0,
            y: gsap.utils.random(28, 72),
            x: gsap.utils.random(-56, 56),
            rotation: gsap.utils.random(-10, 10),
            scale: gsap.utils.random(0.86, 0.98),
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: gsap.utils.random(0.45, 0.95),
            ease: "back.out(1.35)",
            delay: gsap.utils.random(0, 1.05),
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState(null);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDialogError(null);
    setDialogMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setDialogMessage(data.message || "Your message has been sent.");
        setDialogError(null);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setDialogError(data.error || "Failed to send message.");
        setDialogMessage("");
      }
    } catch (err) {
      setDialogError(err?.message || "Failed to send message.");
      setDialogMessage("");
    } finally {
      setIsSubmitting(false);
      setDialogOpen(true);
    }
  };

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setDialogError(null);
      setDialogMessage("");
    }
  };

  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate">
      <div ref={contactRootRef}>
      <Box
        data-contact-anim
        className="bg-slate-800 px-4 py-3 sm:px-6 sm:py-4"
      >
        <Flex gap="6" align="center" wrap="wrap">
          <Button variant="ghost" size="2" asChild>
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-white"
            >
              <HomeIcon {...iconProps} />
              <Text>Home</Text>
            </Link>
          </Button>
          <Button variant="ghost" size="2" asChild>
            <Link
              href="/main"
              className="flex items-center gap-2 text-white hover:text-white"
            >
              <EnvelopeClosedIcon {...iconProps} />
              <Text>Main</Text>
            </Link>
          </Button>
        </Flex>
      </Box>

      <Box className="min-h-screen bg-slate-950 px-4 py-12 sm:px-6">
        <Container size="3" className="mx-auto max-w-xl">
          <Link
            data-contact-anim
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <HomeIcon {...iconProps} />
            ← Back to Home
          </Link>

          <Heading
            data-contact-anim
            size="8"
            weight="bold"
            className="mb-8 text-white"
          >
            Contact
          </Heading>

          <Card size="3" className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box data-contact-anim>
                  <Text
                    as="label"
                    htmlFor="contact-name"
                    size="2"
                    weight="medium"
                    className="mb-2 block text-slate-300"
                  >
                    Name
                  </Text>
                  <TextField.Root
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="First Last"
                    value={formData.name}
                    onChange={handleChange}
                    size="3"
                    className="w-full"
                  />
                </Box>

                <Box data-contact-anim>
                  <Text
                    as="label"
                    htmlFor="contact-email"
                    size="2"
                    weight="medium"
                    className="mb-2 block text-slate-300"
                  >
                    Email
                  </Text>
                  <TextField.Root
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="user@address.com"
                    value={formData.email}
                    onChange={handleChange}
                    size="3"
                    className="w-full"
                    required
                  />
                </Box>

                <Box data-contact-anim>
                  <Text
                    as="label"
                    htmlFor="contact-message"
                    size="2"
                    weight="medium"
                    className="mb-2 block text-slate-300"
                  >
                    Message
                  </Text>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Message text..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full resize-y rounded-md border border-slate-700 bg-slate-900 px-3 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </Box>

                <Flex data-contact-anim justify="end" className="pt-2">
                  <Button
                    type="submit"
                    size="3"
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    {isSubmitting ? "Sending…" : "Submit"}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Card>
        </Container>
      </Box>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <Dialog.Content size="2" maxWidth="360px">
          <Dialog.Title>{dialogError ? "Error" : "Message sent"}</Dialog.Title>
          <Text
            size="2"
            color={dialogError ? "red" : "gray"}
            as="p"
            mt="2"
          >
            {dialogError || dialogMessage}
          </Text>
          <Flex gap="3" mt="4" justify="end" wrap="wrap">
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
