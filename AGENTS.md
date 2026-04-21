# AGENTS.md

## Project goal
Refactor this project so Hasura is the primary app-facing data layer.

## Stack assumptions
- Frontend/app: Next.js
- Database: Neon Postgres
- GraphQL/API layer: Hasura
- Deployment: Vercel

## Rules
- Do not expose database credentials or admin secrets to client-side code.
- Remove direct Neon/Postgres access from client-side code.
- Prefer Hasura for all app-facing data access.
- Keep direct database access only for migrations, schema tooling, scripts, or clearly justified server-only jobs.
- Reuse existing project conventions and dependencies where possible.
- Keep diffs focused and minimal.
- Do not make unrelated style refactors.
- After changes, run lint, typecheck, and tests if scripts exist.

## Output requirements
- Summarize every changed file and why it changed.
- List any manual dashboard or environment variable steps separately.
- Flag any uncertainty before making broad architectural changes.