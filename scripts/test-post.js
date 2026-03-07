/**
 * Create a test post and verify it writes to the database.
 * Run: node --experimental-vm-modules scripts/test-post.js
 * Or with env: DATABASE_URL=... node scripts/test-post.js
 */
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local from project root
config({ path: path.join(__dirname, "..", ".env.local") });
config({ path: path.join(__dirname, "..", ".env") });

async function main() {
  const { addEntry, getEntries } = await import("../src/lib/blogEntries.js");

  if (!process.env.DATABASE_URL && !process.env.PGHOST) {
    console.error("Error: Set DATABASE_URL or PGHOST in .env.local");
    process.exit(1);
  }

  const testPost = {
    title: "Test Post from Script",
    excerpt: "A test post to verify database writes.",
    content:
      "This post was created by scripts/test-post.js to verify the blog app writes to the database correctly.",
  };

  try {
    const post = await addEntry(testPost);
    console.log("Success! Test post created:");
    console.log("  ID:", post.id);
    console.log("  Title:", post.title);
    console.log("  Date:", post.date);
    console.log("\nVerifying in database...");

    const posts = await getEntries();
    const found = posts.find((p) => p.id === post.id);
    if (found) {
      console.log("Confirmed: Post found in database.");
    } else {
      console.log("Warning: Post created but not found in getEntries.");
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
