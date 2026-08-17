# Yarah Workspace Template

A Notion-style collaborative workspace built on Yarah.

**[Features](#features)** · **[Demo](#demo)** · **[Quick launch](#quick-launch)** · **[Step-by-step setup](#step-by-step-setup)** · **[Deploy](#deploy-with-vercel)** · **[Customization](#common-customizations)**

Nested pages, rich-text editing, image embeds, public share links, and multi-user invites — with zero per-deployment configuration.

Built with Next.js, [BlockNote](https://www.blocknotejs.org/), and Yarah. Ships with auth, RLS-enforced multi-user roles, Yarah Storage for file uploads, and copyable invite/share links that work without SMTP or external services.

Inspired by the developer experience of Supabase and Vercel starter repositories, this template is designed to be modified, not just demoed.

Build a collaborative workspace with Yarah auth, database, storage, and RLS without starting from a blank dashboard.

---

## Features

- Email/password and Google OAuth sign-in (Google credentials provided by the Yarah platform)
- Multi-user workspaces with owner / editor / viewer roles, enforced by RLS
- Nested page tree with rich-text editing powered by [BlockNote](https://www.blocknotejs.org/)
- Image and file embeds backed by Yarah Storage
- Public share links per page (no account required to view)
- Workspace invites via copyable link (no SMTP required)
- Single-editor optimistic locking on autosave
- Tailwind + shadcn-style UI primitives

---

## Demo

Demo: [demoworkspace.yarah.dev](https://demoworkspace.yarah.dev)

The template includes sign-up, a nested page tree, BlockNote rich-text editing, public share links, and workspace invite flows for first-run evaluation.

---

## Quick launch

If you want the fastest path, use the Yarah CLI and follow the prompts:

```bash
npx @yarahdev/cli create
```

From there:

1. Choose the workspace template
2. Follow the prompt flow to create or connect your Yarah project
3. Let the CLI handle the initial setup
4. Choose to deploy with [Yarah](https://yarah.dev) automatically from the guided flow

Use the step-by-step setup below if you want to inspect the repo, edit environment variables manually, or control the migration flow yourself.

---

## Step-by-step setup

### 1. Clone the repository

If you have not already done so, clone the repository and install dependencies:

```bash
git clone https://github.com/Darts7u7/Yarah-oos-templates.git
cd yarah-templates/workspace
npm install
```

### 2. Connect your Yarah project

Go to the [Yarah dashboard](https://yarah.dev), create a project, and click **Connect** → **CLI** to get the link command:

```bash
npx @yarahdev/cli link --project-id <your-project-id>
```

### 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Then populate `.env.local` with your project values (find these in the Yarah dashboard under **Connect** → **API Keys**):

| Variable                        | Required                 | Description                                                       |
| ------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_YARAH_URL`      | Yes                      | Your Yarah project URL                                         |
| `NEXT_PUBLIC_YARAH_ANON_KEY` | Yes                      | Public/anon key for the linked project                            |
| `NEXT_PUBLIC_APP_URL`           | Yes for production OAuth | Public app URL used for OAuth callbacks outside local development |

For local development, set `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

### 4. Apply the workspace schema

Apply the migrations to create the workspace tables, RLS policies, and helper RPCs:

```bash
npx @yarahdev/cli db migrations up --all
```

### 5. Create the storage bucket

The file embed feature stores uploads in a public `workspace-files` bucket. Create it with:

```bash
npm run setup
```

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up your first user. Create a workspace, add pages, and try sharing a page link or inviting a collaborator.

---

## Deploy with Vercel

To deploy the template on Vercel:

1. Import the repository into Vercel
2. Set `NEXT_PUBLIC_YARAH_URL`
3. Set `NEXT_PUBLIC_YARAH_ANON_KEY`
4. Set `NEXT_PUBLIC_APP_URL` to your deployed app URL
5. Deploy the project
6. Run `npx @yarahdev/cli db migrations up --all` against the linked Yarah project if you have not already applied the schema
7. Run `npm run setup` to create the `workspace-files` storage bucket

After deploying, sign in and confirm the workspace dashboard, editor, and share/invite flows load successfully.

---

## Common customizations

### Add custom page metadata fields

1. Add the column in a new migration file under `migrations/`
2. Apply it with `npx @yarahdev/cli db migrations up --all`
3. Update the TypeScript types in `lib/workspace-actions.ts`
4. Expose the field in the relevant editor or settings component

### Change the default workspace name

Edit `lib/constants.ts` and update `DEFAULT_WORKSPACE_NAME` to match your product.

### Restrict public share links

Public share is controlled by a `SECURITY DEFINER` RPC in the migrations. To disable public sharing, remove the RPC call from `app/share/[token]/page.tsx` and hide the share dialog in the editor toolbar.

### Replace BlockNote with a different editor

The editor lives in `components/editor/`. Swap the BlockNote import and adapter for any editor that accepts and emits a JSON document structure, then update `lib/workspace-actions.ts` to persist the new format.

---

## Project structure

```
app/
  auth/          Sign-in and sign-up pages
  w/             Workspace shell and page editor
  share/         Public share page (unauthenticated)
  invite/        Invite accept route
  settings/      Workspace settings
components/
  sidebar/       Workspace sidebar, page tree, switcher
  editor/        BlockNote editor and toolbar
  share/         Share dialog and link copy
  invites/       Invite dialog and link copy
  settings/      Settings sections
  ui/            Shared UI primitives
lib/
  yarah.ts          Server-side Yarah client
  yarah-browser.ts  Browser-side Yarah client
  auth-actions.ts      Auth server actions
  workspace-actions.ts Workspace and page server actions
  constants.ts         App-wide constants
migrations/
                 Database schema, RLS policies, and SECURITY DEFINER RPCs
```

---

## License

Apache 2.0
