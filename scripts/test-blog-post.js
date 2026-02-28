/**
 * Test script to verify the blog post workflow.
 * Run with: node scripts/test-blog-post.js
 * Make sure the dev server is running (yarn dev) on port 3000 first.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

async function createTestPost() {
  const post = {
    title: "API Test Post – Workflow Verification",
    excerpt: "This post was created via the API to verify the post.js workflow.",
    content:
      "This post was created by running the test script. If you see this on the blog, the workflow is working correctly. New posts from /blog/post should appear under the existing entries.",
  };

  console.log("Creating test post via POST /api/blog...");
  const res = await fetch(`${BASE}/api/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    throw new Error(`POST failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  console.log("✓ Test post created:", json.post?.title);
  console.log("  ID:", json.post?.id);
  console.log("\nVisit http://localhost:3000/blog to see the post.");
  console.log("Visit http://localhost:3000/blog/" + json.post?.id + " for the full post.");
}

createTestPost().catch((err) => {
  console.error("Error:", err.message);
  console.log("\nMake sure the dev server is running: yarn dev");
  process.exit(1);
});
