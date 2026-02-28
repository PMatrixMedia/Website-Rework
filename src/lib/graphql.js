/**
 * GraphQL client for blog API.
 * Uses fetch to query the backend GraphQL endpoint instead of REST + CORS.
 */

function getGraphqlUrl() {
  if (process.env.NEXT_PUBLIC_GRAPHQL_URL) {
    return process.env.NEXT_PUBLIC_GRAPHQL_URL;
  }
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return base.replace(/\/$/, "") + "/graphql";
}

export async function graphqlRequest(query, variables = {}, options = {}) {
  const res = await fetch(getGraphqlUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify({ query, variables }),
    ...options,
  });

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }
  return json.data;
}

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
