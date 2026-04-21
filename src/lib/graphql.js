/**
 * Server-side Hasura GraphQL helpers for app-facing data access.
 */

function getGraphqlUrl() {
  return process.env.HASURA_GRAPHQL_ENDPOINT || "";
}

export function hasuraConfigured() {
  return Boolean(getGraphqlUrl() && process.env.HASURA_ADMIN_SECRET);
}

function getHeaders(options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (process.env.HASURA_ADMIN_SECRET) {
    headers["x-hasura-admin-secret"] = process.env.HASURA_ADMIN_SECRET;
  }
  return headers;
}

export async function graphqlRequest(query, variables = {}, options = {}) {
  const url = getGraphqlUrl();
  if (!url) {
    throw new Error("HASURA_GRAPHQL_ENDPOINT is not set.");
  }
  if (!process.env.HASURA_ADMIN_SECRET) {
    throw new Error("HASURA_ADMIN_SECRET is not set.");
  }

  const fetchOptions = { ...options };
  delete fetchOptions.headers;
  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(options),
    body: JSON.stringify({ query, variables }),
    ...fetchOptions,
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Invalid GraphQL response (${res.status})`);
  }

  if (!res.ok) {
    const message = json?.errors?.[0]?.message || `GraphQL request failed (${res.status})`;
    throw new Error(message);
  }
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }
  return json.data;
}

// Hasura schema (posts, authors, post_tags, tags)
export const HASURA_POSTS_QUERY = `
  query GetPosts {
    posts(order_by: { created_at: desc }) {
      id
      title
      excerpt
      content
      image_url
      created_at
      author {
        name
        avatar_url
      }
      post_tags {
        tag {
          name
        }
      }
    }
  }
`;

export const HASURA_POST_QUERY = `
  query GetPost($id: Int!) {
    posts_by_pk(id: $id) {
      id
      title
      excerpt
      content
      image_url
      created_at
      author {
        name
        avatar_url
      }
      post_tags {
        tag {
          name
        }
      }
    }
  }
`;

export const HASURA_CREATE_POST_MUTATION = `
  mutation CreatePost($title: String!, $excerpt: String, $content: String!, $author_id: Int!) {
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
      image_url
      created_at
      author { name avatar_url }
      post_tags { tag { name } }
    }
  }
`;

export const HASURA_INSERT_CONTACT_MUTATION = `
  mutation InsertContactSubmission($name: String, $email: String!, $message: String!) {
    insert_contact_submissions_one(
      object: { name: $name, email: $email, message: $message }
    ) {
      id
      created_at
    }
  }
`;

const HASURA_FIRST_AUTHOR_QUERY = `
  query GetFirstAuthor {
    authors(order_by: { id: asc }, limit: 1) {
      id
      name
      avatar_url
    }
  }
`;

const HASURA_UPSERT_TAG_MUTATION = `
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

const HASURA_LINK_TAG_MUTATION = `
  mutation LinkTag($post_id: Int!, $tag_id: Int!) {
    insert_post_tags_one(object: { post_id: $post_id, tag_id: $tag_id }) {
      post_id
    }
  }
`;

function transformPostRow(p) {
  if (!p) return null;
  const tags = (p.post_tags || []).map((pt) => pt.tag?.name).filter(Boolean);
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || "",
    content: p.content || "",
    image: p.image_url,
    date: p.created_at
      ? new Date(p.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
    author: {
      name: p.author?.name || "PhaseMatrix",
      avatar: p.author?.avatar_url,
    },
    tags: tags.length > 0 ? tags : ["update"],
  };
}

export async function getPostsFromGraphql(options = {}) {
  const data = await graphqlRequest(HASURA_POSTS_QUERY, {}, options);
  return (data?.posts || []).map(transformPostRow);
}

export async function getPostFromGraphql(id, options = {}) {
  const data = await graphqlRequest(HASURA_POST_QUERY, { id }, options);
  return transformPostRow(data?.posts_by_pk);
}

export async function createPostViaGraphql({ title, excerpt, content }) {
  const authorData = await graphqlRequest(HASURA_FIRST_AUTHOR_QUERY);
  const author = authorData?.authors?.[0];
  if (!author?.id) {
    throw new Error("No author found in Hasura. Seed the database first.");
  }

  const data = await graphqlRequest(HASURA_CREATE_POST_MUTATION, {
    title: title || "New Post",
    excerpt: excerpt || "",
    content: content || "",
    author_id: author.id,
  });
  const post = data?.insert_posts_one;
  if (!post) return null;

  try {
    const tagData = await graphqlRequest(HASURA_UPSERT_TAG_MUTATION, { name: "update" });
    const tagId = tagData?.insert_tags_one?.id;
    if (tagId) {
      await graphqlRequest(HASURA_LINK_TAG_MUTATION, {
        post_id: post.id,
        tag_id: tagId,
      });
      post.post_tags = [{ tag: { name: "update" } }];
    }
  } catch {
    // Tag link is optional for display.
  }

  return transformPostRow(post);
}
