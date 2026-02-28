# Vercel Environment Variables

Add these in **Vercel** → your project → **Settings** → **Environment Variables**:

## Required for blog (post.js workflow)

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | Your Supabase connection string | Production, Preview |

### Supabase connection strings

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **Project Settings** → **Database**
3. Copy the **Connection string** (URI)

**Transaction pooler** (recommended for Vercel serverless):
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Direct connection**:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

Replace `[PASSWORD]` with your database password. Use the **Transaction** pooler for Vercel.

### Database setup

Run `backend/init_db.sql` against your Supabase database once (via Supabase SQL Editor or `psql`):

```bash
psql "YOUR_DATABASE_URL" -f backend/init_db.sql
```

## Optional

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | Your Flask backend URL (if deployed) |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint URL |
