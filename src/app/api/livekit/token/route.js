import { AccessToken } from "livekit-server-sdk";

export const dynamic = "force-dynamic";

function sanitizeRoomName(raw) {
  const s = String(raw ?? "demo")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return s.slice(0, 128) || "demo";
}

/**
 * Issues a short-lived JWT for joining a LiveKit room (WebRTC).
 * Requires LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET.
 */
export async function POST(request) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !livekitUrl) {
    return Response.json(
      {
        error:
          "LiveKit is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET in the environment.",
      },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const roomName = sanitizeRoomName(body.roomName);
  const displayName = String(body.displayName ?? "Guest").trim().slice(0, 128) || "Guest";
  const identity = `u_${Math.random().toString(36).slice(2, 14)}`;

  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name: displayName,
    ttl: "1h",
  });
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await token.toJwt();
  return Response.json({
    token: jwt,
    url: livekitUrl,
    roomName,
  });
}
