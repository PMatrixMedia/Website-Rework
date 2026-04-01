"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import {
  Theme,
  Box,
  Flex,
  Button,
  Text,
  TextField,
  Heading,
  Card,
  Separator,
  Strong,
  Dialog,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

/**
 * 1:1-style video call UI: LiveKit (WebRTC) + Radix Themes.
 * Tokens are minted by POST /api/livekit/token (server-side secrets).
 *
 * When opened from Main → modal, URL has ?room=…&name=… and we join automatically.
 */
export default function WebConferencing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoJoinDone = useRef(false);

  const [roomName, setRoomName] = useState("demo-room");
  const [displayName, setDisplayName] = useState("");
  const [token, setToken] = useState(undefined);
  const [serverUrl, setServerUrl] = useState(undefined);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const joinWithValues = useCallback(async (room, name) => {
    const r = room.trim() || "demo-room";
    const n = name.trim() || "Guest";
    setError(null);
    setConnecting(true);
    try {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: r,
          displayName: n,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Token request failed (${res.status})`);
      }
      setToken(data.token);
      setServerUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join");
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleJoin = () => {
    void joinWithValues(roomName, displayName);
  };

  const handleLeave = useCallback(() => {
    setToken(undefined);
    setServerUrl(undefined);
    autoJoinDone.current = false;
    router.replace("/webconferencing");
  }, [router]);

  useEffect(() => {
    const room = searchParams.get("room");
    const name = searchParams.get("name");
    if (!room || !name) return;
    if (autoJoinDone.current) return;
    autoJoinDone.current = true;
    setRoomName(room);
    setDisplayName(name);
    void joinWithValues(room, name);
  }, [searchParams, joinWithValues]);

  if (token && serverUrl) {
    return (
      <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="medium">
        <Box className="fixed inset-0 z-50 bg-slate-950" style={{ height: "100dvh" }}>
          <LiveKitRoom
            serverUrl={serverUrl}
            token={token}
            connect
            audio
            video
            data-lk-theme="default"
            onDisconnected={handleLeave}
            style={{ height: "100%" }}
            className="lk-room-container"
          >
            <Flex direction="column" height="100%" style={{ minHeight: 0 }}>
              <Flex
                align="center"
                justify="between"
                p="2"
                gap="3"
                style={{ flexShrink: 0 }}
                className="border-b border-white/10"
              >
                <Text size="2" color="gray">
                  1:1 call — share the same <Strong>room name</Strong> with your peer
                </Text>
                <Button type="button" variant="solid" color="red" size="2" onClick={handleLeave}>
                  Leave
                </Button>
              </Flex>
              <Box className="min-h-0 flex-1" style={{ position: "relative" }}>
                <VideoConference />
              </Box>
            </Flex>
          </LiveKitRoom>
        </Box>
      </Theme>
    );
  }

  const fromQuery = Boolean(searchParams.get("room") && searchParams.get("name"));

  return (
    <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="medium">
      <Box className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-slate-950 p-4">
        <Card size="4" className="w-full max-w-md">
          <Flex direction="column" gap="4" p="4">
            <Flex align="center" justify="between" gap="3" wrap="wrap">
              <Heading size="6">Web conferencing</Heading>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="ghost" size="1" highContrast>
                    About WebRTC
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content style={{ maxWidth: 420 }}>
                  <Dialog.Title>WebRTC & LiveKit</Dialog.Title>
                  <Dialog.Description size="2" mb="3">
                    Media is transported with WebRTC (peer connections orchestrated by LiveKit). This
                    UI uses the LiveKit React SDK and prebuilt <Strong>VideoConference</Strong>{" "}
                    layout, which works well for two participants in one room.
                  </Dialog.Description>
                  <Text as="p" size="2" color="gray" mb="3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </Text>
                  <Flex justify="end" gap="3" mt="2">
                    <Dialog.Close>
                      <Button variant="soft">Close</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
            <Text size="2" color="gray">
              {fromQuery
                ? "Connecting with the room and name from your link…"
                : "Join a room to start a 1:1-style call, or use Features → WebConferencing on the main page."}
            </Text>
            <Separator size="4" />
            {fromQuery && connecting ? (
              <Text size="3" weight="medium">
                Connecting…
              </Text>
            ) : (
              <>
                <label htmlFor="wc-room">
                  <Text size="2" weight="bold" mb="1" as="div">
                    Room name
                  </Text>
                  <TextField.Root
                    id="wc-room"
                    size="3"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. demo-room"
                    autoComplete="off"
                    disabled={connecting}
                  />
                </label>
                <label htmlFor="wc-name">
                  <Text size="2" weight="bold" mb="1" as="div">
                    Your name
                  </Text>
                  <TextField.Root
                    id="wc-name"
                    size="3"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    autoComplete="name"
                    disabled={connecting}
                  />
                </label>
                {error ? (
                  <Text color="red" size="2">
                    {error}
                  </Text>
                ) : null}
                <Button size="3" onClick={handleJoin} disabled={connecting} highContrast>
                  <Strong>{connecting ? "Connecting…" : "Join call"}</Strong>
                </Button>
              </>
            )}
          </Flex>
        </Card>
      </Box>
    </Theme>
  );
}
