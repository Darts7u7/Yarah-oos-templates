<div align="center">
  <a href="https://yarah.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Darts7u7/Yarah-oos/main/assets/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Darts7u7/Yarah-oos/main/assets/logo-light.svg">
      <img src="https://raw.githubusercontent.com/Darts7u7/Yarah-oos/main/assets/logo-dark.svg" alt="Yarah" width="500">
    </picture>
  </a>

  <p>
    <a href="https://github.com/Darts7u7/Yarah-oos"><img src="https://img.shields.io/badge/github-Yarah-181717?logo=github&logoColor=white" alt="GitHub"></a>
    <a href="https://x.com/Yarah_dev"><img src="https://img.shields.io/badge/X-%40Yarah__dev-000000?logo=x&logoColor=white" alt="X"></a>
    <a href="https://yarah.dev/community"><img src="https://img.shields.io/badge/community-Discord-5865F2?logo=discord&logoColor=white" alt="Join community"></a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@yarahdev/cli"><img src="https://img.shields.io/npm/v/@yarahdev/cli" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@yarahdev/cli"><img src="https://img.shields.io/npm/dy/@yarahdev/cli" alt="npm downloads"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  </p>

</div>

## Yarah Templates

Production-ready starters and app templates for Next.js and React.

This repository collects standalone templates you can use to start a new Yarah app quickly, whether you want a minimal framework starter or a more complete product-style template such as a chatbot, CRM, or e-commerce storefront.

## Quick Start

The fastest way to get started is with the Yarah CLI:

```bash
npx @yarahdev/cli create
```

If you prefer to inspect a template manually, clone this repository, move into a template directory, and follow that template's local setup instructions.

## Templates

### Starters

| Template | Framework | Best for | Includes |
| --- | --- | --- | --- |
| [`nextjs`](./nextjs) | Next.js App Router | Learning how to build a Next.js app with Yarah from a clean starting point | Yarah auth setup, protected route example, OAuth support, Tailwind CSS, starter guidance |
| [`react`](./react) | React + Vite | Learning how to use Yarah in a client-side React app | Yarah auth context, protected route example, OAuth support, Tailwind CSS, starter guidance |

### App Templates

| Template | Framework | Best for | Includes |
| --- | --- | --- | --- |
| [`chatbot`](./chatbot) | Next.js App Router | Building an AI chat product on top of Yarah | Persisted chat history, file uploads, auth, storage, optional Vercel AI Gateway support |
| [`crm`](./crm) | Next.js App Router | Building an authenticated internal tool or CRM | Sales pipeline, lead management, client flows, RLS, seeded defaults |
| [`e-commerce`](./e-commerce) | Next.js App Router | Launching a storefront with user accounts and checkout | Seeded catalog, product pages, cart, checkout, account area, analytics |

### Auth Provider Overlays

Not standalone templates. These are scaffolds the CLI overlays on top of an existing project (or a freshly created template) when you pass `--auth <provider>`. They never appear in `npx @yarahdev/cli create`'s template picker — only `--auth better-auth` triggers download.

| Overlay | Provider | Trigger |
| --- | --- | --- |
| [`auth-providers/better-auth`](./auth-providers/better-auth) | [Better Auth](https://better-auth.com) (self-hosted, runs in your own Postgres) | `npx @yarahdev/cli create --template nextjs --auth better-auth` (fresh project) or `npx @yarahdev/cli link --auth better-auth` (existing Next.js project) |

## Features

- Framework starters and app templates built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Vite](https://vite.dev)
- UI foundations built with [Tailwind CSS](https://tailwindcss.com) across the repository
- Authentication, database, and storage integration with [Yarah](https://yarah.dev)
- Per-template setup guides and example environment variables for local development
- Deployment paths designed to work well with [Vercel](https://vercel.com)
- Templates designed to be adapted into real products

## Repository Structure

```text
yarah-templates/
├── chatbot/
├── crm/
├── e-commerce/
├── nextjs/
├── react/
└── ...
```

Each directory is an independent template with its own dependencies, environment variables, and setup instructions.

## Getting Started Manually

1. Clone the repository.
2. Move into the template you want to use.
3. Install dependencies with `npm install`.
4. Copy the template's example environment file.
5. Follow that template's `README.md` for any required Yarah migration, local setup, and deployment steps.

## Per-Template Documentation

For full setup details, go directly to the template README you want to use:

- [`chatbot/README.md`](./chatbot/README.md)
- [`crm/README.md`](./crm/README.md)
- [`e-commerce/README.md`](./e-commerce/README.md)
- [`nextjs/README.md`](./nextjs/README.md)
- [`react/README.md`](./react/README.md)

## Marketplace

Templates listed in [`registry.json`](./registry.json) are surfaced at **https://yarah.dev/templates**.
Use one with the Yarah CLI:

```bash
npx @yarahdev/cli create --marketplace <slug>
```

To contribute a new template, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Provide Feedback

- [Open an issue](../../issues/new) if you believe you've encountered a bug that you want to flag for the team.
