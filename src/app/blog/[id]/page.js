import BlogPost from "../../Pages/Blog/BlogPost";
import { graphqlRequest, POST_QUERY } from "@/lib/graphql";
import { getEntryById } from "@/lib/blogEntries";

export const dynamic = "force-dynamic";

async function getPost(id) {
  const numId = parseInt(id, 10);
  const apiPost = await getEntryById(numId);
  if (apiPost) return apiPost;
  try {
    const data = await graphqlRequest(POST_QUERY, { id: numId }, {
      next: { revalidate: 60 },
    });
    return data?.post || null;
  } catch {
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
