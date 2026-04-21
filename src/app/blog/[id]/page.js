import BlogPost from "../../Pages/Blog/BlogPost";
import { getPostFromGraphql } from "@/lib/graphql";

export const dynamic = "force-dynamic";

async function getPost(id) {
  const numId = parseInt(id, 10);
  if (!Number.isFinite(numId)) return null;
  try {
    const post = await getPostFromGraphql(numId, { next: { revalidate: 60 } });
    return post || null;
  } catch (e) {
    console.error("getPost Hasura error:", e);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (post) {
    return {
      title: `${post.title} | PhaseMatrix Blog`,
      description: post.excerpt || "Read more on PhaseMatrix Media blog",
    };
  }
  return { title: "Post | PhaseMatrix Blog" };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  return <BlogPost post={post} />;
}
