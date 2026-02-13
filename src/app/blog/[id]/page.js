import BlogPost from "../../Pages/Blog/BlogPost";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${apiUrl}/api/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const post = await res.json();
      return {
        title: `${post.title} | PhaseMatrix Blog`,
        description: post.excerpt || "Read more on PhaseMatrix Media blog",
      };
    }
  } catch {}
  return { title: "Post | PhaseMatrix Blog" };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  return <BlogPost postId={id} />;
}
