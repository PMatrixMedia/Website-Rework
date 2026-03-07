# Blog MCP Server

Python MCP server that exposes tools for blog mutations via Hasura GraphQL.

## Tools

- **create_post(title, excerpt, content)** – Create a new blog post
- **list_posts(limit)** – List recent blog posts

## Setup

1. **Install dependencies**
   ```bash
   cd mcp-server
   pip install -r requirements.txt
   # or: uv sync
   ```

2. **Ensure Hasura is running** at http://localhost:8080 with tables tracked

3. **Environment** (optional – defaults work for local dev)
   - `HASURA_GRAPHQL_URL` – Hasura endpoint (default: http://localhost:8080/v1/graphql)
   - `HASURA_GRAPHQL_ADMIN_SECRET` – Admin secret (default: devsecret)

## Cursor Integration

The server is configured in `.cursor/mcp.json`. Restart Cursor after setup.

If the server fails to start, run manually to verify:
```bash
cd mcp-server && python server.py
```
