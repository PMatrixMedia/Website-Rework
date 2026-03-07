# Vercel + Supabase Setup Guide

## Quick checklist

- [ ] Supabase project exists and is **active** (not paused)
- [ ] `DATABASE_URL` set in Vercel (Production + Preview)
- [ ] `init_db.sql` run in Supabase SQL Editor
- [ ] Redeploy Vercel after changing env vars

---

## 1. Supabase setup

### Create or restore your project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. **If the project was paused** (free tier inactivity): click **Restore project**
4. Note your **Project reference** (e.g. `abcdefghijklmnop`) from the URL or Settings

### Get the connection string

1. In your project, click **Connect** (top right) or go to **Project Settings** → **Database**
2. Under **Connection string**, choose **URI**
3. Use one of these:

**Session pooler** (recommended for Vercel – works with `pg`, supports IPv4):
```
postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Transaction pooler** (alternative – use if Session fails):
```
postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres
```

- Replace `[PROJECT-REF]` with your project reference (e.g. `vxqanrpnklukoqvrwtrs`)
- Replace `[YOUR-PASSWORD]` with your database password
- Replace `[REGION]` with your region (e.g. `us-east-1`)
- **URL-encode** special characters in the password (e.g. `@` → `%40`, `#` → `%23`)

### Run the database schema

1. In Supabase, go to **SQL Editor**
2. Open `backend/init_db.sql` locally and copy its contents
3. Paste into the SQL Editor and click **Run**
4. Confirm tables `authors`, `tags`, `posts`, `post_tags` were created

---

## 2. Vercel environment variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project
2. **Settings** → **Environment Variables**
3. Add:

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | Your Supabase connection string (from step 1) | Production, Preview |

4. **Redeploy** the project (Deployments → ⋮ → Redeploy) so new env vars take effect.

---

## 3. Troubleshooting

### `getaddrinfo ENOTFOUND db.xxx.supabase.co`

- **Cause:** The Supabase project may be paused, deleted, or the project reference is wrong.
- **Fix:**
  1. Check [Supabase Dashboard](https://supabase.com/dashboard) – is the project active?
  2. If paused, click **Restore project**
  3. Try the **Session pooler** URL (`aws-0-[REGION].pooler.supabase.com`) instead of `db.xxx.supabase.co`
  4. Copy a fresh connection string from **Connect** in the dashboard

### `init_db.sql has been run`

- Run `backend/init_db.sql` in Supabase **SQL Editor** once.
- If tables already exist, the script uses `IF NOT EXISTS` and `ON CONFLICT`, so re-running is safe.

### Password / authentication errors

- Regenerate the database password in **Project Settings** → **Database**
- Ensure special characters in the password are URL-encoded in `DATABASE_URL`

---

## Optional

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | Your Flask backend URL (if deployed) |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint URL |
