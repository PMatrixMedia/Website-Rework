import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { getDb } from "./db";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "blog-entries.json");

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
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    date: row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : row.date || "",
    tags: row.tags || ["update"],
    author: { name: row.author_name || "PhaseMatrix", avatar: row.author_avatar },
  };
}

async function getEntriesFromDb() {
  const pool = getDb();
  const res = await pool.query(`
    SELECT p.id, p.title, p.excerpt, p.content, p.created_at,
           a.name as author_name, a.avatar_url as author_avatar
    FROM posts p
    LEFT JOIN authors a ON p.author_id = a.id
    ORDER BY p.created_at DESC
  `);
  const tagsRes = await pool.query(`
    SELECT pt.post_id, array_agg(t.name) as tags
    FROM post_tags pt
    JOIN tags t ON pt.tag_id = t.id
    GROUP BY pt.post_id
  `);
  const tagsMap = Object.fromEntries(
    tagsRes.rows.map((r) => [r.post_id, r.tags])
  );
  return res.rows.map((r) => {
    const post = rowToPost(r);
    post.tags = tagsMap[r.id] || ["update"];
    return post;
  });
}

async function addEntryToDb({ title, excerpt, content }) {
  const pool = getDb();
  await pool.query(
    `INSERT INTO tags (name) VALUES ('update') ON CONFLICT (name) DO NOTHING`
  );
  const insertRes = await pool.query(
    `INSERT INTO posts (title, excerpt, content, author_id)
     VALUES ($1, $2, $3, 1)
     RETURNING id, title, excerpt, content, created_at`,
    [
      title || "Untitled",
      excerpt || content?.slice(0, 120) || "New update",
      content || excerpt,
    ]
  );
  const row = insertRes.rows[0];
  const tagRes = await pool.query(`SELECT id FROM tags WHERE name = 'update'`);
  const tagId = tagRes.rows[0]?.id;
  if (tagId) {
    await pool.query(
      `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)`,
      [row.id, tagId]
    );
  }
  return rowToPost({
    ...row,
    author_name: "PhaseMatrix",
    author_avatar: null,
    tags: ["update"],
  });
}

export async function getEntries() {
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
  try {
    const pool = getDb();
    const res = await pool.query(
      `SELECT p.id, p.title, p.excerpt, p.content, p.created_at,
              a.name as author_name, a.avatar_url as author_avatar
       FROM posts p
       LEFT JOIN authors a ON p.author_id = a.id
       WHERE p.id = $1`,
      [numId]
    );
    const row = res.rows[0];
    if (row) {
      const tagsRes = await pool.query(
        `SELECT t.name FROM tags t
         JOIN post_tags pt ON t.id = pt.tag_id
         WHERE pt.post_id = $1`,
        [numId]
      );
      const post = rowToPost(row);
      post.tags = tagsRes.rows.map((r) => r.name) || ["update"];
      return post;
    }
  } catch (e) {
    console.error("blogEntries getEntryById DB error:", e);
  }
  const fileData = loadFileEntries();
  const found = (fileData.entries || []).find((p) => p.id === numId);
  return found || null;
}

export async function addEntry({ title = "New Post", excerpt = "", content = "" }) {
  try {
    return await addEntryToDb({ title, excerpt, content });
  } catch (e) {
    console.error("blogEntries addEntry DB error, using file fallback:", e);
  }
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
