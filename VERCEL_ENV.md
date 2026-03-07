# Vercel + Hasura + Neon Setup Guide

## Quick checklist

- [ ] Neon project exists and is accessible
- [ ] Hasura endpoint is reachable
- [ ] `HASURA_GRAPHQL_ENDPOINT` set in Vercel (Production + Preview)
- [ ] `HASURA_ADMIN_SECRET` set in Vercel (Production + Preview)
- [ ] `init_db.sql` applied to Neon database
- [ ] Redeploy Vercel after changing env vars

---

## 1. Neon setup

Use these Neon resources:

- **Org:** `org-sweet-hat-08378913`
- **Project:** `little-surf-12235556`

### Get the connection string

1. Open your Neon project in [Neon Console](https://console.neon.tech/)
2. Go to **Connection Details**
3. Copy the **pooled** PostgreSQL connection string for your target branch (usually main)
4. Ensure SSL is enabled in the URL (Neon URLs include this by default)

Example shape:

```bash
postgresql://<user>:<password>@<endpoint>/<database>?sslmode=require
```

### Run the database schema

1. Open **SQL Editor** in Neon (or run `psql` locally)
2. Execute `backend/init_db.sql`
4. Confirm tables `authors`, `tags`, `posts`, `post_tags` were created

---

## 2. Vercel environment variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project
2. **Settings** → **Environment Variables**
3. Add:

| Name | Value | Environments |
|------|-------|--------------|
| `HASURA_GRAPHQL_ENDPOINT` | `https://model-honeybee-77.hasura.app/v1/graphql` | Production, Preview |
| `HASURA_ADMIN_SECRET` | Your Hasura admin secret | Production, Preview |

4. **Redeploy** the project (Deployments → ⋮ → Redeploy) so new env vars take effect.

---

## 3. Troubleshooting

### Connection or DNS errors

- **Cause:** Wrong endpoint, password, or blocked outbound network.
- **Fix:**
  1. Verify `HASURA_GRAPHQL_ENDPOINT` exactly matches your Hasura Cloud endpoint
  2. Confirm `HASURA_ADMIN_SECRET` is copied correctly
  3. Test a GraphQL request from local terminal before redeploying

### `init_db.sql has been run`

- Run `backend/init_db.sql` against Neon once.
- If tables already exist, the script uses `IF NOT EXISTS` and `ON CONFLICT`, so re-running is safe.

### Password / authentication errors

- Rotate the admin secret in Hasura and update `HASURA_ADMIN_SECRET` in Vercel
- Confirm no extra spaces/newlines in environment variable values

---

## Optional

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | Your Flask backend URL (if deployed) |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint URL |
