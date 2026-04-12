# Vercel + Hasura + Neon Setup Guide

## Quick checklist

- [ ] Neon project exists and is accessible
- [ ] Hasura endpoint is reachable and points at the same database you initialized
- [ ] `HASURA_GRAPHQL_ENDPOINT` set in Vercel (Production + Preview)
- [ ] `HASURA_ADMIN_SECRET` set in Vercel (Production + Preview)
- [ ] `init_db.sql` applied to the database Hasura uses (often Neon)
- [ ] Redeploy Vercel after changing env vars

---

## 1. Neon setup

- In the [Neon Console](https://console.neon.tech/), open your **project** and target **branch** (usually `main`).
- Go to **Connection details** and copy the **pooled** PostgreSQL connection string.
- Ensure SSL is enabled (`sslmode=require` is typical for Neon).

Example shape:

```bash
postgresql://<user>:<password>@<endpoint>/<database>?sslmode=require
```

Use this URI in **Hasura** as the database URL (Hasura Cloud or self-hosted), not necessarily as a Vercel var, unless you add server code that connects with `pg` via `DATABASE_URL` (see optional variables below).

### Run the database schema

- Open **SQL Editor** in Neon (or run `psql` with the same connection string).
- Execute `backend/init_db.sql` from this repository.
- Confirm tables such as `authors`, `tags`, `posts`, `post_tags`, and `contact_submissions` exist (per script).

---

## 2. Vercel environment variables

- Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project.
- **Settings** → **Environment Variables**.
- Add the variables below for **Production** and **Preview** (and **Development** if you use Vercel env pull locally).
- **Redeploy** (Deployments → ⋮ → Redeploy) so new values load into the runtime.

### Required for blog + contact (Hasura path)

| Name | Value | Notes |
| ---- | ----- | ----- |
| `HASURA_GRAPHQL_ENDPOINT` | `https://<your-project>.hasura.app/v1/graphql` | Must match the GraphQL endpoint Hasura serves. |
| `HASURA_ADMIN_SECRET` | Admin secret from Hasura | Used server-side only; never `NEXT_PUBLIC_*`. |

### Required for contact email (Resend path)

| Name | Value | Notes |
| ---- | ----- | ----- |
| `RESEND_API_KEY` | Resend API key | Needed for `/api/contact` email and the Hasura contact webhook email. |

### Optional

| Name | Purpose |
| ---- | ------- |
| `CONTACT_FROM_EMAIL` | Verified sender in Resend (e.g. `PhaseMatrix <contact@yourdomain.com>`). If unset, code falls back to Resend’s onboarding sender where applicable. |
| `CONTACT_TO_EMAIL` | Inbox for contact notifications from `/api/contact` when using Resend (defaults to `info@phasematrixmedia.com` in code if unset). |
| `NEXT_PUBLIC_GRAPHQL_URL` | Overrides the GraphQL URL on the client when set; server code prefers `HASURA_GRAPHQL_ENDPOINT`. See `src/lib/graphql.js`. |
| `NEXT_PUBLIC_API_URL` | Legacy Flask-style API base URL when not using Hasura for GraphQL. |
| `DATABASE_URL` | Neon pooled URI if you use `src/lib/db.js` with `pg` directly (currently unused by shipped routes; safe to add for future features). |

---

## 3. Hasura event trigger (contact emails)

If inserts go to Hasura first, configure an **Event trigger** on `contact_submissions` that POSTs to:

`https://<your-deployment>.vercel.app/api/webhooks/hasura/contact`

Example (replace host with your deployment): see [Vercel deployment URLs](https://vercel.com/docs/deployments/overview).

Details and local tunneling: see `HASURA_SETUP.md`.

---

## 4. Troubleshooting

### Connection or DNS errors

- **Cause:** Wrong Hasura URL, wrong secret, or network blocking outbound requests.
- **Fix:**
  - Verify `HASURA_GRAPHQL_ENDPOINT` matches Hasura **Settings → API endpoint**.
  - Confirm `HASURA_ADMIN_SECRET` has no leading/trailing spaces or newlines.
  - From your machine, run a small `curl` POST with `x-hasura-admin-secret` before redeploying.

### Missing tables / blog or contact failures

- Run `backend/init_db.sql` against the **same** database Hasura metadata tracks.
- The script is written to be re-runnable where it uses `IF NOT EXISTS` / sensible defaults; duplicate key errors on seed data may still need a glance at the script.

### Password / authentication errors

- Rotate the admin secret in Hasura and update `HASURA_ADMIN_SECRET` in Vercel.
- Trim whitespace in all secret values.

### Yarn warnings (`engine "pnpm"`, workspaces)

- Those come from **transitive** packages (e.g. tooling that declares a `pnpm` engine). They do not stop `yarn install` or `next build` on Vercel if the build completed; upgrading dependencies over time may clear them.
