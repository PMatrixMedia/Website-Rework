/**
 * Shared contact submission helpers: Hasura and Resend email.
 */

import {
  graphqlRequest,
  HASURA_INSERT_CONTACT_MUTATION,
  hasuraConfigured,
} from "@/lib/graphql";
import { Resend } from "resend";

const DEFAULT_TO_EMAIL = "info@phasematrixmedia.com";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

/**
 * @returns {{ ok: true, id: number, source: 'hasura' } | { ok: false, error: string }}
 */
export async function submitToHasura({ name, email, message }) {
  if (!hasuraConfigured()) {
    return { ok: false, error: "Hasura not configured" };
  }

  try {
    const data = await graphqlRequest(HASURA_INSERT_CONTACT_MUTATION, {
      name: name || null,
      email,
      message,
    });
    const row = data?.insert_contact_submissions_one;
    if (!row?.id) {
      return { ok: false, error: "Failed to save submission." };
    }
    return { ok: true, id: row.id, source: "hasura" };
  } catch (e) {
    return { ok: false, error: e?.message || "Hasura submission failed" };
  }
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
  const safeName = escapeHtml(name || "(not provided)");
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const text = [
    message,
    "",
    "---",
    `From: ${name || "(not provided)"}`,
    `Reply-To: ${email}`,
  ].join("\n");
  const html = [
    `<p>${safeMessage}</p>`,
    "<hr>",
    `<p><strong>From:</strong> ${safeName}<br>`,
    `<strong>Reply-To:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>`,
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
