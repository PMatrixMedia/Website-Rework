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

### Contact form

1. Add the `contact_submissions` table (see `backend/init_db.sql` – run the `CREATE TABLE contact_submissions ...` block on your database if you already ran init previously).
2. In Hasura Console: **Data** → track the `contact_submissions` table.
3. **Event Trigger (email to info@phasematrixmedia.com):**
   - **Events** → **Create Trigger**.
   - **Trigger name:** `contact_form_email`
   - **Schema / Table:** `public` / `contact_submissions`
   - **Webhook URL:** your app’s full URL + path, e.g. `https://your-app.vercel.app/api/webhooks/hasura/contact`  
     (For local dev, use a tunnel like [ngrok](https://ngrok.com): `ngrok http 3000` then use the HTTPS URL + `/api/webhooks/hasura/contact`.)
   - **Insert:** enable, leave columns as * (all).
   - Create the trigger.

   **Or** apply via Metadata API (replace `REPLACE_WITH_YOUR_APP_URL` in `hasura/event_triggers/contact_form_email.json`, then):
   ```bash
   curl -X POST http://localhost:8080/v1/metadata \
     -H "Content-Type: application/json" \
     -H "x-hasura-admin-secret: devsecret" \
     -d @hasura/event_triggers/contact_form_email.json
   ```

   When a row is inserted into `contact_submissions`, Hasura POSTs the event to the webhook; the Next.js route at `/api/webhooks/hasura/contact` sends the email via Resend. Set `RESEND_API_KEY` (and optionally `CONTACT_FROM_EMAIL`) in your Next.js app env (e.g. Vercel).

### Contact form: `id` NOT NULL / null value in column `id`

If GraphQL/Postgres returns **`null value in column "id"`** or **`violates not-null constraint`** on insert:

1. **Fix the database** (recommended): run `backend/migrations/fix_contact_submissions_id.sql` on your Postgres so `id` has a proper `DEFAULT` / sequence.
2. **Or** rely on the Next.js `/api/contact` fallback: set **`RESEND_API_KEY`** so submissions still reach **info@phasematrixmedia.com** when Hasura insert fails.

In Hasura **Permissions** for inserts (non-admin roles), only allow columns **`name`**, **`email`**, **`message`** — do **not** set column presets for **`id`** (let the database default apply).

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
