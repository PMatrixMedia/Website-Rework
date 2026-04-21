import { createPostViaGraphql, getPostsFromGraphql } from "@/lib/graphql";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getPostsFromGraphql({ cache: "no-store" });
  return Response.json({ posts });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title = "New Post", excerpt = "", content = "" } = body;
    const post = await createPostViaGraphql({ title, excerpt, content });
    if (!post) {
      return Response.json({ error: "Failed to create post" }, { status: 500 });
    }
    return Response.json({ success: true, post });
  } catch (e) {
    console.error("POST /api/blog error:", e);
    const message = e?.message || "Failed to save post";
    return Response.json({ error: message }, { status: 400 });
  }
}
