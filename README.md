# Portfolio — Aniket Adhav

Personal portfolio and showcase built with [Remix](https://remix.run/) and [Vite](https://vite.dev/), featuring 3D graphics powered by Three.js and modern WebAssembly shaders.

## Tech Stack

- **Framework**: Remix v2 + Vite
- **UI & 3D**: React 18, Three.js, Three-stdlib, Framer Motion
- **Deployment**: Vercel (Native zero-configuration via `@vercel/remix`)
- **Theme**: Dark mode by default with light mode toggle

## Getting Started

### Prerequisites

- Node.js `20.x` or `22.x`
- npm (or compatible package manager)

### Installation

```bash
# Install project dependencies and copy 3D Draco decoder assets
npm install
```

### Development

To start the local development server:

```bash
npm run dev
```

The app will be available at [http://localhost:4000](http://localhost:4000).

### Production Build

To build the project for production:

```bash
npm run build
```

To test the production build locally:

```bash
npm run start
```

## Deploying to Vercel

This repository is optimized for **zero-configuration** Vercel deployment using the official `@vercel/remix/vite` preset:

1. Push this repository to GitHub/GitLab.
2. In the [Vercel Dashboard](https://vercel.com/), select **Add New > Project** and import the repository.
3. Framework Preset will automatically be detected as **Remix**.
4. (Optional) In **Environment Variables**, add `SESSION_SECRET` with a secure random string.
5. Click **Deploy**. Vercel will build and deploy without requiring custom server wrappers or complex configs.
