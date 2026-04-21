import {
  createPostViaGraphql,
  getPostFromGraphql,
  getPostsFromGraphql,
} from "./graphql.js";

export async function getEntries(options = {}) {
  return getPostsFromGraphql(options);
}

export async function getEntryById(id, options = {}) {
  const numId = parseInt(id, 10);
  if (!Number.isFinite(numId)) return null;
  return getPostFromGraphql(numId, options);
}

export async function addEntry({ title = "New Post", excerpt = "", content = "" }) {
  return createPostViaGraphql({ title, excerpt, content });
}
