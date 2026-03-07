# Hasura GraphQL

Hasura provides an auto-generated GraphQL API over your Supabase PostgreSQL database.

## Setup

1. **Copy env file**
   ```bash
   cp .env.example .env
   ```

2. **Set `HASURA_GRAPHQL_METADATA_DATABASE_URL`** in `.env`
   - Get from [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → Database
   - Use **Session pooler** URI: `postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`

3. **Start Hasura**
   ```bash
   docker compose up -d
   ```

4. **Open Console** at http://localhost:8080/console
   - Enter admin secret from `.env` (default: `devsecret`)

5. **Connect database** (if not auto-connected)
   - Data tab → Connect Database → PostgreSQL
   - Use same `HASURA_GRAPHQL_METADATA_DATABASE_URL`

6. **Track tables**
   - Data → [your database] → Track All for `authors`, `tags`, `posts`, `post_tags`
   - Or: Track tables individually and set up relationships

## GraphQL Endpoint

- **Local:** http://localhost:8080/v1/graphql
- **Headers:** `x-hasura-admin-secret: devsecret` (for admin access)

## Frontend

Set in `.env.local`:
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=devsecret
```
