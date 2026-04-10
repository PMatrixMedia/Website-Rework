/**
 * GraphQL client for blog API.
 * Supports Hasura (default) and legacy Flask/Graphene backend.
 */

function getGraphqlUrl() {
  if (process.env.NEXT_PUBLIC_GRAPHQL_URL) {
    return process.env.NEXT_PUBLIC_GRAPHQL_URL;
  }
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return base.replace(/\/$/, "") + "/graphql";
}

function isHasura() {
  const url = getGraphqlUrl();
  return url.includes("/v1/graphql") || url.includes(":8080");
}

function getHeaders(options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (isHasura() && process.env.HASURA_ADMIN_SECRET) {
    headers["x-hasura-admin-secret"] = process.env.HASURA_ADMIN_SECRET;
  }
  return headers;
}

export async function graphqlRequest(query, variables = {}, options = {}) {
  const res = await fetch(getGraphqlUrl(), {
    method: "POST",
    headers: getHeaders(options),
    body: JSON.stringify({ query, variables }),
    ...options,
  });

  const json = await res.json();
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
  mutation CreatePost($title: String!, $excerpt: String, $content: String!) {
    insert_posts_one(
      object: {
        title: $title
        excerpt: $excerpt
        content: $content
        author_id: 1
      }
    ) {
      id
      title
      excerpt
      content
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

// Legacy Flask/Graphene schema
export const POSTS_QUERY = `
  query GetPosts {
    posts {
      id
      title
      excerpt
      image
      date
      author {
        name
        avatar
      }
      tags
    }
  }
`;

export const POST_QUERY = `
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      excerpt
      content
      image
      date
      author {
        name
        avatar
      }
      tags
    }
  }
`;

export const CREATE_POST_MUTATION = `
  mutation CreatePost($title: String, $excerpt: String, $content: String) {
    createPost(title: $title, excerpt: $excerpt, content: $content) {
      success
      post {
        id
        title
        excerpt
        content
        date
        author { name avatar }
        tags
      }
    }
  }
`;

// Resolve which queries to use
function getQueries() {
  if (isHasura()) {
    return {
      postsQuery: HASURA_POSTS_QUERY,
      postQuery: HASURA_POST_QUERY,
      createMutation: HASURA_CREATE_POST_MUTATION,
      transformPosts: (data) => {
        const posts = data?.posts || [];
        return posts.map((p) => ({
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
          tags: (p.post_tags || []).map((pt) => pt.tag?.name).filter(Boolean) || ["update"],
        }));
      },
      transformPost: (data) => {
        const p = data?.posts_by_pk;
        if (!p) return null;
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
          tags: (p.post_tags || []).map((pt) => pt.tag?.name).filter(Boolean) || ["update"],
        };
      },
      transformCreateResponse: (data) => data?.insert_posts_one,
    };
  }
  return {
    postsQuery: POSTS_QUERY,
    postQuery: POST_QUERY,
    createMutation: CREATE_POST_MUTATION,
    transformPosts: (data) => data?.posts || [],
    transformPost: (data) => data?.post || null,
    transformCreateResponse: (data) => data?.createPost?.post,
  };
}

export async function getPostsFromGraphql(options = {}) {
  const q = getQueries();
  const data = await graphqlRequest(q.postsQuery, {}, options);
  return q.transformPosts(data);
}

export async function getPostFromGraphql(id, options = {}) {
  const q = getQueries();
  const data = await graphqlRequest(q.postQuery, { id }, options);
  return q.transformPost(data);
}

export async function createPostViaGraphql({ title, excerpt, content }) {
  const q = getQueries();
  const data = await graphqlRequest(q.createMutation, {
    title: title || "New Post",
    excerpt: excerpt || "",
    content: content || "",
  });
  const post = q.transformCreateResponse(data);
  if (!post) return null;
  // For Hasura: link to 'update' tag
  if (isHasura() && post.id) {
    try {
      const tagData = await graphqlRequest(
        `query { tags(where: {name: {_eq: "update"}}) { id } }`
      );
      const tagId = tagData?.tags?.[0]?.id;
      if (tagId) {
        await graphqlRequest(
          `mutation LinkTag($post_id: Int!, $tag_id: Int!) {
            insert_post_tags_one(object: {post_id: $post_id, tag_id: $tag_id}) { post_id }
          }`,
          { post_id: post.id, tag_id: tagId }
        );
      }
    } catch {
      // Tag link optional
    }
  }
  if (isHasura()) {
    return q.transformPost({
      posts_by_pk: { ...post, post_tags: [{ tag: { name: "update" } }] },
    });
  }
  return post;
}
