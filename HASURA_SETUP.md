# Hasura + Python MCP Setup

## Overview

- **Hasura** – GraphQL engine over Supabase PostgreSQL (replaces Flask GraphQL)
- **Python MCP Server** – Exposes `create_post` and `list_posts` tools for AI/LLM use

## 1. Hasura

### Start Hasura

```bash
cd hasura
cp .env.example .env
# Edit .env: set HASURA_GRAPHQL_METADATA_DATABASE_URL (Supabase Session pooler URI)
docker compose up -d
```

### Configure

1. Open http://localhost:8080/console (admin secret: `devsecret`)
2. Data → Connect Database (if needed) – use same Supabase URI
3. Track tables: `authors`, `tags`, `posts`, `post_tags`
4. Track relationships (Hasura infers from foreign keys)

### GraphQL Endpoint

- **URL:** http://localhost:8080/v1/graphql
- **Header:** `x-hasura-admin-secret: devsecret`

## 2. Python MCP Server

### Install

```bash
cd mcp-server
pip install -r requirements.txt
```

### Run

The server is configured in `.cursor/mcp.json`. Restart Cursor to load it.

### Tools

| Tool         | Description                    |
|--------------|--------------------------------|
| `create_post` | Create a blog post             |
| `list_posts`  | List recent posts              |

## 3. Frontend

Set in `.env.local`:

```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=devsecret
```

**Security:** For production, avoid exposing the admin secret to the client. Use Hasura permissions and/or a backend proxy.

## 4. Flow

1. **Blog list/detail** – Next.js fetches from Hasura GraphQL
2. **Create post (form)** – `createPostViaGraphql()` → Hasura `insert_posts_one`
3. **Create post (AI)** – MCP tool `create_post` → Hasura GraphQL
