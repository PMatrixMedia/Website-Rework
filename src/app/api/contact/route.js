import { HASURA_INSERT_CONTACT_MUTATION } from "@/lib/graphql";

export const dynamic = "force-dynamic";

function getHasuraConfig() {
  const endpoint =
    process.env.HASURA_GRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL;
  const adminSecret =
    process.env.HASURA_ADMIN_SECRET ||
    process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  return { endpoint, adminSecret };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!email || !message) {
      return Response.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    const { endpoint, adminSecret } = getHasuraConfig();
    if (!endpoint || !adminSecret) {
      console.error("Contact API: Hasura endpoint or admin secret not set.");
      return Response.json(
        {
          error:
            "Contact form is not configured. Set HASURA_GRAPHQL_ENDPOINT and HASURA_ADMIN_SECRET.",
        },
        { status: 503 }
      );
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

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      const msg = json.errors[0]?.message || "GraphQL error";
      console.error("Contact API Hasura error:", json.errors);
      return Response.json({ error: msg }, { status: 400 });
    }

    const data = json.data?.insert_contact_submissions_one;
    if (!data) {
      return Response.json(
        { error: "Failed to save submission." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id: data.id,
      message: "Your message has been sent. We'll get back to you soon.",
    });
  } catch (e) {
    console.error("POST /api/contact error:", e);
    return Response.json(
      { error: e?.message || "Failed to submit contact form." },
      { status: 500 }
    );
  }
}
