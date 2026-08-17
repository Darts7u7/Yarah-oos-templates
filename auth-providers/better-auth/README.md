# Better Auth + Yarah — Overlay

This is **not a standalone template**. It's a scaffold that the Yarah CLI overlays on top of an existing Next.js project (or one freshly created from a base template) when you pass `--auth better-auth`.

## How it's used

```bash
# Fresh project — base Next.js template plus this overlay in one step
npx @yarahdev/cli create --template nextjs --auth better-auth

# Existing Next.js project — overlay only, leaves your code intact
npx @yarahdev/cli link --auth better-auth
```

The CLI reads `manifest.json`, copies the files listed under `files`, deep-merges `packageJsonPatch` into your `package.json` (your existing values win on conflict), and appends `envExampleAppend` to `.env.example` (skipping any keys you've already defined).

## What gets dropped

- `src/lib/auth.ts` — Better Auth server (Postgres pool, email + password)
- `src/lib/auth-client.ts` — Better Auth React client
- `src/lib/yarah.ts` — `useYarahClient` hook (Pattern A)
- `src/lib/yarah.server.ts` — `createYarahClient` for RSC / server actions (Pattern B)
- `src/lib/yarah-server-mailer.ts` — server-side mailer using Yarah's email service
- `src/app/api/auth/[...all]/route.ts` — Better Auth route handler
- `src/app/api/yarah-token/route.ts` — bridge route that signs HS256 with `YARAH_JWT_SECRET`
- `src/app/sign-up/page.tsx`, `src/app/sign-in/page.tsx` — working email + password UI
- `migrations/0001_better-auth-bootstrap.sql` — single bootstrap migration: `CREATE SCHEMA better_auth`, `pgcrypto` extension, and `public.requesting_user_id()` helper. Applied via `yarah db migrations up --to 0001` BEFORE `auth:migrate`. Anything you add later with `yarah db migrations new <name>` lives in the same `migrations/` dir and gets applied via `up --all` after BA's CLI has created its tables.

## Why an overlay, not a template

Auth provider scaffolds don't replace a base template — they layer on top. Putting Better Auth as a separate `nextjs-better-auth` template would force users into an either/or choice (and crowd the CLI's template picker). The overlay model means a user can pick `chatbot` (or any base) and still add Better Auth.

This directory is invisible to the CLI's template picker — only `--auth better-auth` triggers download.

## Manual install (no CLI)

The CLI's overlay logic isn't required. You can clone this directory and copy the files manually:

```bash
git clone https://github.com/Darts7u7/Yarah-oos-templates.git
cp -r yarah-templates/auth-providers/better-auth/{src,migrations} your-project/
# Then edit your package.json to add the deps from manifest.json's packageJsonPatch
# (and the auth:migrate + setup scripts), and write .env.local with the values
# from manifest.json's envExampleAppend.
```

See the [Yarah Better Auth integration guide](https://staging.yarah.dev/integrations/better-auth) for the full walk-through and the [skill reference](https://github.com/Yarah/yarah-skills/blob/main/skills/yarah-integrations/references/better-auth.md) for plugins, custom claims, and common-mistake guidance.
