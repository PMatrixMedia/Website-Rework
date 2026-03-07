"""
Blog MCP Server - Exposes tools for blog mutations via Hasura GraphQL.
Handles create_post and other mutations that the AI/LLM can invoke.
"""
import os
from mcp.server.fastmcp import FastMCP
from mcp.types import TextContent
import httpx
from dotenv import load_dotenv

load_dotenv()

HASURA_URL = os.getenv("HASURA_GRAPHQL_URL", "http://localhost:8080/v1/graphql")
HASURA_ADMIN_SECRET = os.getenv("HASURA_GRAPHQL_ADMIN_SECRET", "devsecret")

mcp = FastMCP(
    "Blog MCP Server",
    json_response=True,
)


def _graphql_request(query: str, variables: dict | None = None) -> dict:
    """Execute a GraphQL request against Hasura."""
    payload = {"query": query, "variables": variables or {}}
    headers = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    }
    with httpx.Client(timeout=30.0) as client:
        resp = client.post(HASURA_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
    if data.get("errors"):
        raise RuntimeError(data["errors"][0].get("message", "GraphQL error"))
    return data.get("data", {})


@mcp.tool()
def create_post(title: str, excerpt: str = "", content: str = "") -> str:
    """
    Create a new blog post. Inserts into posts table and links to 'update' tag.
    Use this when the user wants to add a blog entry or create a post.
    """
    mutation = """
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
      }
    }
    """
    try:
        data = _graphql_request(mutation, {
            "title": title or "Untitled",
            "excerpt": excerpt or (content[:120] if content else "New update"),
            "content": content or excerpt or "",
        })
        post = data.get("insert_posts_one")
        if not post:
            return "Failed to create post."
        # Link to 'update' tag
        tag_query = """
        query GetUpdateTag { tags(where: {name: {_eq: "update"}}) { id } }
        """
        tag_data = _graphql_request(tag_query)
        tag_id = tag_data.get("tags", [{}])[0].get("id") if tag_data.get("tags") else None
        if tag_id:
            link_mutation = """
            mutation LinkTag($post_id: Int!, $tag_id: Int!) {
              insert_post_tags_one(object: {post_id: $post_id, tag_id: $tag_id}) { post_id }
            }
            """
            _graphql_request(link_mutation, {"post_id": post["id"], "tag_id": tag_id})
        return f"Post created: id={post['id']}, title={post['title']}"
    except Exception as e:
        return f"Error: {e}"


@mcp.tool()
def list_posts(limit: int = 10) -> str:
    """
    List recent blog posts. Returns id, title, date for each post.
    """
    query = """
    query ListPosts($limit: Int!) {
      posts(order_by: {created_at: desc}, limit: $limit) {
        id
        title
        excerpt
        created_at
      }
    }
    """
    try:
        data = _graphql_request(query, {"limit": limit})
        posts = data.get("posts", [])
        if not posts:
            return "No posts found."
        lines = [f"- [{p['id']}] {p['title']} ({p['created_at'][:10]})" for p in posts]
        return "\n".join(lines)
    except Exception as e:
        return f"Error: {e}"


if __name__ == "__main__":
    mcp.run(transport="stdio")
