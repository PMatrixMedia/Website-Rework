import { submitToHasura } from "@/lib/contactSubmit";

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

    const db = await submitToHasura(payload);
    if (db.ok) {
      return Response.json({
        success: true,
        id: db.id,
        message:
          "Your message has been sent. We'll get back to you soon.",
      });
    }

    console.error("Contact API: Hasura failed:", db.error);
    return Response.json(
      {
        error:
          "Contact form could not be saved. Check HASURA_GRAPHQL_ENDPOINT and HASURA_ADMIN_SECRET.",
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
