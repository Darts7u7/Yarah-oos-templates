<h1 align="center">React Yarah Starter</h1>

<p align="center">
  The fastest way to build apps with React and Yarah
</p>

<p align="center">
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#quick-launch"><strong>Quick launch</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a>
</p>

<p align="center">
  <img src="react-starter.png" alt="React Yarah Starter" />
</p>
<br />

## Demo

Check out the live demo: [demoreact.yarah.dev](https://demoreact.yarah.dev)

## Features

- Works across a modern [React](https://react.dev) starter stack
  - React 19
  - Vite
  - React Router
  - TypeScript
  - It just works
- [Yarah](https://yarah.dev) auth configured across the starter app
- Viewer state wired through a shared auth context for the starter routes
- Protected example route with signed-in user details and starter steps
- Optional Google and GitHub OAuth providers
- Browser-side auth actions using [`@yarahdev/sdk`](https://www.npmjs.com/package/@yarahdev/sdk)
- Starter homepage with environment setup guidance
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Ready for local development and Vercel deployment

## Quick launch

If you want the fastest path, use the Yarah CLI and follow the prompts:

```bash
npx @yarahdev/cli create
```

From there:

1. Choose the React starter template
2. Follow the prompt flow to create or connect your Yarah project
3. Let the CLI handle the initial setup
4. Choose to deploy with [Yarah](https://yarah.dev) from the guided flow

Use the sections below if you want to set up the starter manually.

## Clone and run locally

1. Clone this repository and move into the starter directory.

```bash
git clone https://github.com/Darts7u7/Yarah-oos-templates.git
cd yarah-templates/react
```

2. Install dependencies.

```bash
npm install
```

3. Go to the [Yarah dashboard](https://yarah.dev), create a project, and click **Connect** → **CLI** to get the link command:

```bash
npx @yarahdev/cli link --project-id <your-project-id>
```

4. Copy `env.example` to `.env.local` and update the values with your Yarah project settings (find these in the Yarah dashboard under **Connect** → **API Keys**):

```bash
cp env.example .env.local
```

Set the following values in `.env.local`:

```env
VITE_YARAH_URL=https://your-project.region.apps.yarah.dev
VITE_YARAH_ANON_KEY=your-anon-key
```

You can find the project URL and anon key in your Yarah project settings.

5. Start the development server.

```bash
npm run dev
```

The starter should now be running on [localhost:5173](http://localhost:5173).

## Deploy to Vercel

Click [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYarah%2Fyarah-templates&root-directory=react&project-name=yarah-react-starter&repository-name=yarah-react-starter&env=VITE_YARAH_URL,VITE_YARAH_ANON_KEY&envDescription=Connect%20your%20Yarah%20project%20URL%20and%20anon%20key.&external-id=https%3A%2F%2Fgithub.com%2FYarah%2Fyarah-templates%2Ftree%2Fmain%2Freact&demo-title=React%20Yarah%20Starter&demo-description=A%20clean%20React%20and%20Vite%20starter%20with%20Yarah%20auth%20and%20Tailwind%20CSS.&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FYarah%2Fyarah-templates%2Fmain%2Freact%2Freact-starter.png), then fill in the required environment variables during the setup flow:

- `VITE_YARAH_URL`
- `VITE_YARAH_ANON_KEY`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYarah%2Fyarah-templates&root-directory=react&project-name=yarah-react-starter&repository-name=yarah-react-starter&env=VITE_YARAH_URL,VITE_YARAH_ANON_KEY&envDescription=Connect%20your%20Yarah%20project%20URL%20and%20anon%20key.&external-id=https%3A%2F%2Fgithub.com%2FYarah%2Fyarah-templates%2Ftree%2Fmain%2Freact&demo-title=React%20Yarah%20Starter&demo-description=A%20clean%20React%20and%20Vite%20starter%20with%20Yarah%20auth%20and%20Tailwind%20CSS.&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FYarah%2Fyarah-templates%2Fmain%2Freact%2Freact-starter.png)

After importing into Vercel:

1. In your Yarah dashboard, open `Authentication` → `General` → `Allowed Redirect URLs`
2. Add your deployed callback URL, for example `https://your-project.vercel.app/auth/callback`
3. If you test locally as well, also allow `http://localhost:5173/auth/callback`

The above will also clone the starter kit to your GitHub, so you can clone it locally and continue development there.
