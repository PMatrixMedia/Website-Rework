import {
  hasuraConfigured,
  submitToHasura,
  sendContactViaResend,
  appendContactLocalLog,
} from "@/lib/contactSubmit";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!email || !message) {
      return Response.json(
        { error: "Email and message are required." },
        { status: 400 },
      );
    }

    const payload = { name, email, message };

    // 1) Try Hasura (database) when configured
    if (hasuraConfigured()) {
      const db = await submitToHasura(payload);
      if (db.ok) {
        return Response.json({
          success: true,
          id: db.id,
          message:
            "Your message has been sent. We'll get back to you soon.",
        });
      }
      console.error("Contact API: Hasura failed, trying fallbacks:", db.error);
    }

    // 2) Resend email fallback (works without Hasura)
    const mail = await sendContactViaResend(payload);
    if (mail.ok) {
      return Response.json({
        success: true,
        message:
          "Your message has been sent. We'll get back to you soon.",
      });
    }

    // 3) Local dev fallback
    const local = appendContactLocalLog(payload);
    if (local.ok) {
      return Response.json({
        success: true,
        message:
          "Your message was saved locally (dev). Configure Hasura or RESEND_API_KEY for production.",
      });
    }

    const hint = hasuraConfigured()
      ? "Hasura rejected the submission; Resend and local save also failed."
      : "Set HASURA_GRAPHQL_ENDPOINT + HASURA_ADMIN_SECRET, or RESEND_API_KEY for email.";
    console.error("Contact API: all paths failed.", {
      resend: mail.error,
      local: local.error,
    });
    return Response.json(
      {
        error: `Contact form could not be delivered. ${hint}`,
      },
      { status: 503 },
    );
  } catch (e) {
    console.error("POST /api/contact error:", e);
    return Response.json(
      { error: e?.message || "Failed to submit contact form." },
      { status: 500 },
    );
  }
}
