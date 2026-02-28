import Blog from "../Pages/Blog/blog";
import { graphqlRequest, POSTS_QUERY } from "@/lib/graphql";

export const metadata = {
  title: "Blog | PhaseMatrix Media",
  description: "Updates, news, and insights from PhaseMatrix Media",
};

const FALLBACK_POSTS = [
  {
    id: 1,
    title: "Welcome to PhaseMatrix Media Blog",
    excerpt: "Updates and insights from our team. Stay tuned for the latest news, tutorials, and behind-the-scenes content.",
    date: "Feb 13, 2025",
    tags: ["welcome", "updates"],
    author: { name: "PhaseMatrix", avatar: null },
  },
  {
    id: 2,
    title: "Website Redesign in Progress",
    excerpt: "We're rebuilding our site with a fresh look, improved navigation, and mobile-friendly design. Expect more updates soon.",
    date: "Feb 12, 2025",
    tags: ["design", "news"],
    author: { name: "PhaseMatrix", avatar: null },
  },
  {
    id: 3,
    title: "New Features Coming Soon",
    excerpt: "Explore what we have in store for the future. New features, integrations, and improvements are on the roadmap.",
    date: "Feb 10, 2025",
    tags: ["features", "roadmap"],
    author: { name: "PhaseMatrix", avatar: null },
  },
];

async function getPosts() {
  try {
    const data = await graphqlRequest(POSTS_QUERY, {}, {
      next: { revalidate: 60 },
    });
    return data?.posts || FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <Blog posts={posts} />;
}
