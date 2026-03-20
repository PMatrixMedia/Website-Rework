import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "blog-entries.json");
const DEFAULT_HASURA_ENDPOINT = "https://model-honeybee-77.hasura.app/v1/graphql";

function getHasuraConfig() {
  return {
    endpoint: process.env.HASURA_GRAPHQL_ENDPOINT || DEFAULT_HASURA_ENDPOINT,
    adminSecret: process.env.HASURA_ADMIN_SECRET,
  };
}

function canUseHasura() {
  const { endpoint, adminSecret } = getHasuraConfig();
  return Boolean(endpoint && adminSecret);
}

async function hasuraRequest(query, variables = {}) {
  const { endpoint, adminSecret } = getHasuraConfig();
  if (!adminSecret) {
    throw new Error("HASURA_ADMIN_SECRET is not set.");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": adminSecret,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    const message = json?.errors?.[0]?.message || `Hasura request failed (${res.status})`;
    throw new Error(message);
  }
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || "Hasura GraphQL error");
  }
  return json.data;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadFileEntries() {
  try {
    ensureDataDir();
    if (existsSync(FILE_PATH)) {
      const raw = readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("blogEntries file load error:", e);
  }
  return { entries: [], nextId: 100 };
}

function saveFileEntries(data) {
  try {
    ensureDataDir();
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("blogEntries file save error:", e);
  }
}

function rowToPost(row) {
  if (!row) return null;
  const createdAt = row.created_at || row.date;
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    date: createdAt
      ? new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
    tags: row.tags || ["update"],
    author: { name: row.author_name || "PhaseMatrix", avatar: row.author_avatar },
  };
}

async function getEntriesFromDb() {
  const query = `
    query GetBlogData {
      posts(order_by: { created_at: desc }) {
        id
        title
        excerpt
        content
        created_at
        author_id
      }
      authors {
        id
        name
        avatar_url
      }
      post_tags {
        post_id
        tag_id
      }
      tags {
        id
        name
      }
    }
  `;

  const data = await hasuraRequest(query);
  const authorsById = Object.fromEntries(
    (data.authors || []).map((a) => [a.id, a])
  );
  const tagsById = Object.fromEntries((data.tags || []).map((t) => [t.id, t.name]));
  const tagsByPostId = {};
  for (const link of data.post_tags || []) {
    if (!tagsByPostId[link.post_id]) tagsByPostId[link.post_id] = [];
    if (tagsById[link.tag_id]) tagsByPostId[link.post_id].push(tagsById[link.tag_id]);
  }

  return (data.posts || []).map((r) => {
    const author = authorsById[r.author_id] || {};
    const post = rowToPost(r);
    post.author = {
      name: author.name || "PhaseMatrix",
      avatar: author.avatar_url || null,
    };
    post.tags = tagsByPostId[r.id] || ["update"];
    return post;
  });
}

async function addEntryToDb({ title, excerpt, content }) {
  const getAuthorQuery = `
    query GetFirstAuthor {
      authors(order_by: { id: asc }, limit: 1) {
        id
        name
        avatar_url
      }
    }
  `;
  const authorData = await hasuraRequest(getAuthorQuery);
  const author = authorData?.authors?.[0];
  if (!author) {
    throw new Error("No author found in Hasura. Seed the database first.");
  }

  const upsertTagMutation = `
    mutation UpsertTag($name: String!) {
      insert_tags_one(
        object: { name: $name }
        on_conflict: { constraint: tags_name_key, update_columns: [name] }
      ) {
        id
        name
      }
    }
  `;
  const tagData = await hasuraRequest(upsertTagMutation, { name: "update" });
  const tagId = tagData?.insert_tags_one?.id;
  if (!tagId) {
    throw new Error("Failed to create or fetch update tag.");
  }

  const insertPostMutation = `
    mutation InsertPost($title: String!, $excerpt: String!, $content: String!, $author_id: Int!) {
      insert_posts_one(
        object: {
          title: $title
          excerpt: $excerpt
          content: $content
          author_id: $author_id
        }
      ) {
        id
        title
        excerpt
        content
        created_at
      }
    }
  `;
  const insertPostData = await hasuraRequest(insertPostMutation, {
    title: title || "Untitled",
    excerpt: excerpt || content?.slice(0, 120) || "New update",
    content: content || excerpt || "",
    author_id: author.id,
  });
  const row = insertPostData?.insert_posts_one;
  if (!row?.id) {
    throw new Error("Failed to insert post in Hasura.");
  }

  const linkTagMutation = `
    mutation LinkTagToPost($post_id: Int!, $tag_id: Int!) {
      insert_post_tags_one(object: { post_id: $post_id, tag_id: $tag_id }) {
        post_id
        tag_id
      }
    }
  `;
  await hasuraRequest(linkTagMutation, { post_id: row.id, tag_id: tagId });

  return rowToPost({
    ...row,
    author_name: author.name || "PhaseMatrix",
    author_avatar: author.avatar_url || null,
    tags: ["update"],
  });
}

export async function getEntries() {
  if (!canUseHasura()) {
    const fileData = loadFileEntries();
    return [...(fileData.entries || [])];
  }
  try {
    return await getEntriesFromDb();
  } catch (e) {
    console.error("blogEntries getEntries DB error:", e);
    const fileData = loadFileEntries();
    return [...(fileData.entries || [])];
  }
}

export async function getEntryById(id) {
  const numId = parseInt(id, 10);
  if (!canUseHasura()) {
    const fileData = loadFileEntries();
    const found = (fileData.entries || []).find((p) => p.id === numId);
    return found || null;
  }
  try {
    const query = `
      query GetPostById($id: Int!) {
        posts(where: { id: { _eq: $id } }, limit: 1) {
          id
          title
          excerpt
          content
          created_at
          author_id
        }
        authors {
          id
          name
          avatar_url
        }
        post_tags(where: { post_id: { _eq: $id } }) {
          post_id
          tag_id
        }
        tags {
          id
          name
        }
      }
    `;
    const data = await hasuraRequest(query, { id: numId });
    const row = data?.posts?.[0];
    if (row) {
      const authorsById = Object.fromEntries(
        (data.authors || []).map((a) => [a.id, a])
      );
      const tagsById = Object.fromEntries((data.tags || []).map((t) => [t.id, t.name]));
      const post = rowToPost(row);
      const author = authorsById[row.author_id] || {};
      post.author = {
        name: author.name || "PhaseMatrix",
        avatar: author.avatar_url || null,
      };
      post.tags =
        (data.post_tags || []).map((link) => tagsById[link.tag_id]).filter(Boolean) || [
          "update",
        ];
      return post;
    }
  } catch (e) {
    console.error("blogEntries getEntryById Hasura error:", e);
  }
  const fileData = loadFileEntries();
  const found = (fileData.entries || []).find((p) => p.id === numId);
  return found || null;
}

export async function addEntry({ title = "New Post", excerpt = "", content = "" }) {
  if (!canUseHasura()) {
    const data = loadFileEntries();
    const { entries, nextId } = data;
    const post = {
      id: nextId,
      title: title || "Untitled",
      excerpt: excerpt || content?.slice(0, 120) || "New update",
      content: content || excerpt,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      tags: ["update"],
      author: { name: "PhaseMatrix", avatar: null },
    };
    entries.push(post);
    saveFileEntries({ entries, nextId: nextId + 1 });
    return post;
  }
  try {
    return await addEntryToDb({ title, excerpt, content });
  } catch (e) {
    console.error("blogEntries addEntry Hasura error:", e);
    // On Vercel/serverless, file fallback fails (read-only filesystem) and doesn't persist.
    // Throw so the user gets a real error instead of fake "success" with no persisted post.
    if (process.env.VERCEL) {
      throw new Error(
        `Hasura error: ${e.message}. Ensure HASURA_GRAPHQL_ENDPOINT and HASURA_ADMIN_SECRET are set in Vercel.`
      );
    }
    // Local dev: fall back to file storage when Hasura is unavailable
    const data = loadFileEntries();
    const { entries, nextId } = data;
    const post = {
      id: nextId,
      title: title || "Untitled",
      excerpt: excerpt || content?.slice(0, 120) || "New update",
      content: content || excerpt,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      tags: ["update"],
      author: { name: "PhaseMatrix", avatar: null },
    };
    entries.push(post);
    saveFileEntries({ entries, nextId: nextId + 1 });
    return post;
  }
}
