import BlogPost from "../../Pages/Blog/BlogPost";

async function getPost(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${apiUrl}/api/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
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
