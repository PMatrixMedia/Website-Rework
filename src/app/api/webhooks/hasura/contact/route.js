import { Resend } from "resend";

export const dynamic = "force-dynamic";

const CONTACT_TO_EMAIL = "info@phasematrixmedia.com";

/**
 * Hasura Event Trigger webhook: when a row is inserted into contact_submissions,
 * Hasura POSTs the event here. We send an email to info@phasematrixmedia.com.
 *
 * Payload shape: { payload: { event: { data: { new: { id, name, email, message, created_at } }, op: "INSERT" }, table: { name, schema }, trigger: { name } } }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const payload = body.payload ?? body;
    const event = payload.event ?? {};
    const data = event.data ?? {};
    const row = data.new ?? {};

    if (event.op !== "INSERT") {
      return Response.json({ message: "Ignored (not insert)" }, { status: 200 });
    }

    const tableName = payload.table?.name ?? "";
    if (tableName !== "contact_submissions") {
      return Response.json({ message: "Ignored (wrong table)" }, { status: 200 });
    }

    const name = row.name != null ? String(row.name).trim() : "";
    const email = row.email != null ? String(row.email).trim() : "";
    const message = row.message != null ? String(row.message).trim() : "";

    if (!email || !message) {
      return Response.json(
        { error: "Missing email or message in payload" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Hasura contact webhook: RESEND_API_KEY not set.");
      return Response.json(
        { error: "Email not configured" },
        { status: 503 }
      );
    }

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
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Hasura contact webhook Resend error:", error);
      return Response.json(
        { error: error?.message ?? "Failed to send email" },
        { status: 500 }
      );
    }

    return Response.json({
      message: "Email sent to info@phasematrixmedia.com",
    });
  } catch (e) {
    console.error("Hasura contact webhook error:", e);
    return Response.json(
      { error: e?.message ?? "Webhook error" },
      { status: 500 }
    );
  }
}
