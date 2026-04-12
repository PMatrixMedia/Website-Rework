This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project uses **Yarn 4** (Berry) with `node_modules` (see `yarn.lock` and `.yarnrc.yml`). Do not use `npm install` — it can conflict with Yarn’s lockfile.

**Yarn not found (Windows / PowerShell):** use Node’s Corepack (ships with Node 16.10+):

```bash
corepack enable
corepack prepare yarn@4.13.0 --activate
```

If `corepack enable` fails with `EPERM`, run the terminal **as Administrator** once, or install Node with a user-writable prefix.

Install and run the development server:

```bash
yarn install
yarn dev
```

**`EPERM` / “Access denied” on `tailwindcss-oxide*.node` (Windows):** Cursor/VS Code, a dev server, or antivirus often keeps that file open. Do this in order:

1. **Fully quit the editor** — **File → Exit** (not only closing the window). In Task Manager, end any leftover **Node.js** or **Cursor** tasks.
2. From the repo root, run the helper script (stops Node/esbuild, clears attributes, uses a robocopy workaround, then `yarn install`):

   ```powershell
   yarn windows:reinstall
   ```

   or:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\windows-reinstall.ps1
   ```

3. If deletion still fails, open **PowerShell as Administrator**, `cd` to the repo, run `yarn windows:reinstall` again (the script will try `takeown` / `icacls` on the stuck file).
4. Last resort: **reboot** (nothing left to lock the file), then run step 2, or add a **Windows Defender exclusion** for `E:\code\Website-Rework` (adjust path if yours differs).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
