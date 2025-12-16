<!-- Copilot / AI agent instructions for contributors and coding agents -->

# Copilot Instructions — homepage

Purpose: give an AI coding agent the minimum, actionable repo knowledge to be productive quickly.

**Big Picture**

- Framework: React single-page app built with Vite. Entry: `src/main.jsx` and top-level `src/components/App.jsx`.
- UI: small component-per-folder structure under `src/components/` (examples: `Home`, `Projects`, `MainContent`, `Navbar`).
- Data model: the site is driven by static JSON + markdown in `public/data/repos/` — each repo has an `info.json` (metadata) and `README.md` (content). The index list lives at `public/data/repos/index.json` and is fetched by the frontend.
- Offline data tooling: `utils/get_repos_info.py` collects GitHub repo metadata and writes the `info.json` + `README.md` files used by the site.

**Where to look first (quick onboarding)**

- App entry: `src/main.jsx` -> `src/components/App.jsx`.
- Projects and data flow: `src/components/Projects/Projects.jsx` and `src/components/MainContent/MainContent.jsx` (these fetch `/data/repos/index.json` and per-repo files).
- Repo data structure and generator: `public/data/repos/` and `utils/get_repos_info.py`.
- Build and deploy: `package.json` scripts and `vite.config.js`.

**Developer workflows & commands**

- Install deps: `npm install` (or `npm ci` for CI).
- Dev server: `npm run dev` (runs `vite`).
- Build: `npm run build` -> outputs `dist`.
- Preview production build: `npm run preview` (vite preview).
- Deploy to GitHub Pages: `npm run deploy` (builds then `gh-pages -d dist`). `package.json` contains `homepage` set to the GitHub Pages URL.

If `npm run dev` fails, check that dependencies are installed (`node_modules`), re-run `npm install`, and ensure a compatible Node version is used. Dev server logs will show failing `fetch` requests to `/data/*` if required JSON files are missing.

**Project-specific conventions**

- CSS modules: styles use `.module.css` files colocated with components (`Component/Component.module.css`).
- Component folders: one folder per component, file named like `Component.jsx` and optional `Component.module.css`.
- Static-data pattern: For repository entries the frontend expects two files per repo: `info.json` and `README.md`. Example fetch pattern (used in code):

```js
// pseudo from src code
const meta = await fetch(`/data/repos/${name}/info.json`).then((r) => r.json());
const readme = await fetch(`/data/repos/${name}/README.md`).then((r) => r.text());
meta.readme = readme;
```

- Markdown rendering: `showdown` (npm dep) is used to render README.md content in the UI.

**Adding or updating repo data**

- Preferred method: run `utils/get_repos_info.py` (it collects GitHub info and writes `info.json` + `README.md`). If editing by hand, add a folder under `public/data/repos/<repo-name>/` with `info.json` and `README.md`, and list the repo directory name in `public/data/repos/index.json`.

**Integration points & external deps**

- Deployment: `gh-pages` (devDependency) + `npm run deploy`. `package.json` has `homepage` configured.
- UI libs: `@mui/material`, `primereact`, `react-multi-carousel`, `react-router-dom`, `@theme-toggles/react` — follow existing usage patterns in components.
- Build tool: Vite (`vite` and `@vitejs/plugin-react`). `vite.config.js` sets `base: "/"`.

**Debugging tips (project-specific)**

- If projects or readme content doesn't show: check `public/data/repos/index.json` and that each repo folder contains `info.json` and `README.md`.
- If markdown rendering looks wrong: check `showdown` usage in `Projects` or `MainContent` components.
- For visual/style issues: components use CSS modules; check `Component.module.css` colocated files.

**Files to reference when making changes**

- `src/main.jsx`, `src/components/App.jsx`, `src/components/Projects/Projects.jsx`, `src/components/MainContent/MainContent.jsx`, `src/components/Home/Home.jsx`
- `public/data/repos/` and `utils/get_repos_info.py`
- `package.json`, `vite.config.js`

If anything here is unclear or you want more detail (examples of data shapes, exact component props, or a checklist for adding a new repo), tell me which area to expand and I will update this file.
