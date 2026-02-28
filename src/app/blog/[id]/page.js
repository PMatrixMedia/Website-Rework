import BlogPost from "../../Pages/Blog/BlogPost";
import { graphqlRequest, POST_QUERY } from "@/lib/graphql";

async function getPost(id) {
  try {
    const data = await graphqlRequest(POST_QUERY, { id: parseInt(id, 10) }, {
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
