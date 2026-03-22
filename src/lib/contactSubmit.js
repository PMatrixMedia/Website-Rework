/**
 * Shared contact submission helpers: Hasura, Resend email, optional local file log.
 */

import { mkdirSync, appendFileSync, existsSync } from "fs";
import path from "path";
import { HASURA_INSERT_CONTACT_MUTATION } from "@/lib/graphql";
import { Resend } from "resend";

const DEFAULT_TO_EMAIL = "info@phasematrixmedia.com";

export function getHasuraConfig() {
  const endpoint =
    process.env.HASURA_GRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL;
  const adminSecret =
    process.env.HASURA_ADMIN_SECRET ||
    process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  return { endpoint, adminSecret };
}

export function hasuraConfigured() {
  const { endpoint, adminSecret } = getHasuraConfig();
  return Boolean(endpoint && adminSecret);
}

/**
 * @returns {{ ok: true, id: number, source: 'hasura' } | { ok: false, error: string }}
 */
export async function submitToHasura({ name, email, message }) {
  const { endpoint, adminSecret } = getHasuraConfig();
  if (!endpoint || !adminSecret) {
    return { ok: false, error: "Hasura not configured" };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": adminSecret,
    },
    body: JSON.stringify({
      query: HASURA_INSERT_CONTACT_MUTATION,
      variables: { name: name || null, email, message },
    }),
  });

  let json;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: "Invalid response from Hasura" };
  }

  if (json.errors && json.errors.length > 0) {
    const msg = json.errors[0]?.message || "GraphQL error";
    return { ok: false, error: msg };
  }

  const data = json.data?.insert_contact_submissions_one;
  if (!data?.id) {
    return { ok: false, error: "Failed to save submission." };
  }

  return { ok: true, id: data.id, source: "hasura" };
}

/**
 * Send contact form to inbox via Resend (same target as Hasura webhook).
 * @returns {{ ok: true, source: 'resend' } | { ok: false, error: string }}
 */
export async function sendContactViaResend({ name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "PhaseMatrix Contact <onboarding@resend.dev>";
  const resend = new Resend(apiKey);
  const subject = name ? `Contact form: ${name}` : "Contact form submission";
  const text = [
    message,
    "",
    "---",
    `From: ${name || "(not provided)"}`,
    `Reply-To: ${email}`,
  ].join("\n");
  const html = [
    `<p>${message.replace(/\n/g, "<br>")}</p>`,
    "<hr>",
    `<p><strong>From:</strong> ${name || "(not provided)"}<br>`,
    `<strong>Reply-To:</strong> <a href="mailto:${email}">${email}</a></p>`,
  ].join("");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject,
    text,
    html,
  });

  if (error) {
    return { ok: false, error: error?.message ?? "Failed to send email" };
  }

  return { ok: true, source: "resend" };
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACT_LOG = path.join(DATA_DIR, "contact-submissions.jsonl");

/**
 * Append one JSON line for local dev when DB/email unavailable (not for Vercel).
 */
export function appendContactLocalLog({ name, email, message }) {
  if (process.env.VERCEL) {
    return { ok: false, error: "File log not available on Vercel" };
  }
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const line =
      JSON.stringify({
        name: name || null,
        email,
        message,
        at: new Date().toISOString(),
      }) + "\n";
    appendFileSync(CONTACT_LOG, line, "utf8");
    return { ok: true, source: "file" };
  } catch (e) {
    return { ok: false, error: e?.message || "Failed to write local log" };
  }
}
