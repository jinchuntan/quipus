# Quipus

A minimal product website and interactive sample workspace for Quipus by Fovea.

## Run

Use Node.js 24 LTS (also declared in `.nvmrc`).

```sh
npm ci
npm run dev
```

- `/` — product page
- `/?mode=sample` — sample workspace

```sh
npm test
npm run build
npm run preview
```

## Deploy on Vercel

1. Import this GitHub repository in Vercel as a new project.
2. Use the **Vite** framework preset and **Node.js 24.x**.
3. Deploy. `vercel.json` already sets `npm ci`, `npm run build`, and the `dist` output directory.

No environment variables, API keys, database, or paid service are required for this version. The app uses a query parameter rather than client-side path routes, so it needs no catch-all rewrite. Commit the lockfile; Vercel installs its exact versions.

To replace an existing Vercel site, connect its project to this repository and deploy `main`. GitHub repository creation alone does not update an existing Vercel deployment or domain.

## What works

- Responsive product page and a sample workspace accessible directly through `?mode=sample`.
- Conversation search across names, companies, context, and decisions.
- People-to-conversation navigation and linked conversation details.
- Recap and illustrative transcript tabs.
- Follow-up completion saved in this browser's local storage, with an explicit fallback if storage is unavailable.
- Markdown note downloads.
- A review form that downloads a 30-minute `.ics` file; it does **not** send calendar invitations or contact anyone.
- Keyboard search shortcut (`/`), native modal dialogs, visible focus states, reduced-motion support, and mobile layouts.

## Prototype boundaries

All conversations, people and companies in the sample workspace are fictional. This is a frontend prototype; it does not record audio, pair with hardware, connect to Agora, transcribe, run AI, authenticate users, or sync data to a backend. No raw recordings are present. The interface makes these limits visible rather than simulating a connected device or completed AI requests.

Device pairing, original-audio storage/playback, upload retries, transcription, cross-conversation retrieval, real accounts and approved integrations should be implemented behind authenticated server APIs. Keep service secrets on the server. Never put private keys into `VITE_*` variables, which are bundled into client code. The supplied Permissions-Policy disables microphone/camera access for this prototype; change it deliberately if real browser recording is added.

## Edit

- `src/App.tsx`: page content and interactive workspace
- `src/styles.css`: responsive visual system
- `src/data.ts`: clearly marked fictional samples and export utilities
- `src/Icons.tsx`: lightweight inline UI icons
- `public/quipus-concept.png`: illustrative device concept, not a photograph of a finished product
- `public/fovea-logo.webp`: Fovea brand asset supplied through the official brand website

The Google Fonts stylesheet loads DM Sans and Manrope; system sans-serif fallbacks are provided. No analytics or tracking scripts are included.

## Validation

`npm run build` performs strict TypeScript checking and creates the production bundle. `npm test` checks navigation, search, connected conversation details, task persistence, corrupt-storage recovery, export controls, and calendar field escaping.

## Design source

The requested reference `https://roxanne-two.vercel.app/?mode=sample` returned `DEPLOYMENT_NOT_FOUND` during this build, and no Roxanne/Quipus source repository was available in the connected account. This is a fresh implementation from the supplied Quipus specification, not a verified migration of that unavailable deployment.
