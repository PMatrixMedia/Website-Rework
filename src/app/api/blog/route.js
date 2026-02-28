import { getEntries, addEntry } from "@/lib/blogEntries";

export async function GET() {
  const posts = await getEntries();
  return Response.json({ posts });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title = "New Post", excerpt = "", content = "" } = body;
    const post = await addEntry({ title, excerpt, content });
    return Response.json({ success: true, post });
  } catch (e) {
    console.error("POST /api/blog error:", e);
    return Response.json({ error: e.message }, { status: 400 });
  }
}
