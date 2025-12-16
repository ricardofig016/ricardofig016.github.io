<!-- Copilot / AI agent instructions for contributors and coding agents -->

# Copilot Instructions — homepage

Goal: give an AI agent just enough repo context to ship useful changes quickly.

## Big Picture

- SPA built with Vite + React Router (`src/main.jsx` → `src/App.jsx`).
- Layout frame lives in `App.jsx`: `Navbar` + `MainContent` wrapper + `Footer` around routed pages.
- Portfolio data is static content under `public/data/` and `public/images/`; the runtime only fetches from those files (no backend).
- Python helper `utils/get_repos_info.py` syncs GitHub metadata/README into `public/data/repos/*` based on `public/data/repos/repos.json` (stores `context`, `featured`, hero `image`).

## Where to Start

- Routing + data fetch: read `src/App.jsx` (fetches `/data/repos/index.json`, then per-repo `info.json` + `README.md`, derives `featuredProjects`).
- Project views: `src/pages/Projects/Projects.jsx` handles list + detail routes (`/projects/:code`), filters, showdown markdown conversion, image carousel + modal.
- Home landing: `src/pages/Home/Home.jsx` consumes `featuredProjectsData` to render hero + carousel.
- Styling pattern: CSS modules colocated with each component/page (`Component/Component.module.css`). Global resets live in `src/styles.css`.

## Data & Content Pipeline

- `public/data/repos/index.json` is an ordered array of repo folder names; `App.jsx` iterates that list when preloading metadata.
- Every repo folder contains `info.json` (GitHub stats, languages, context, readme path, etc.) and `README.md`. Images surface from `public/images/repos/<code>/`.
- To add/update repos, edit `public/data/repos/repos.json` (toggle `featured`, default image, `context`). Run `python utils/get_repos_info.py` with `GITHUB_TOKEN` env var to regenerate `info.json`, `README.md`, and refresh `index.json`.
- Frontend assumes `info.json` includes `code`, `name`, `languages`, `description`, `github_url`, `images`, optional `whatILearned`, `related`, `website`, and `featured` flags.

## UI Patterns & Dependencies

- React Router v7: `BrowserRouter` with nested `Routes` (top-level in `App.jsx`, nested inside `Projects.jsx`). Remember to provide fallback routes when adding new sections.
- `react-multi-carousel` drives both Home and Project image carousels; adjust responsive config in-place rather than reusing global settings.
- Markdown rendering uses `showdown` (`project.readmeHtml = converter.makeHtml(project.readme)`); sanitize before injecting if you introduce new sources.
- Custom controls (`Select`, `CollapsibleSection`, `ImageModal`, `ThemeToggle`) live under `src/components/`; follow the existing prop/aria patterns when reusing.

## Developer Workflows

- Install dependencies: `npm install` (repo is private: true, so no publish).
- Local dev: `npm run dev` (Vite); ensure `/public/data/**` exists or fetch calls will 404.
- Build/preview: `npm run build` → `dist/`, `npm run preview` to smoke-test the prod bundle.
- Deploy to GitHub Pages: `npm run deploy` (runs `vite build` then `gh-pages -d dist`, URL comes from `package.json:homepage`).
- Lint (optional): `npm run lint` uses flat ESLint config in `eslint.config.js`.

## Debugging & Gotchas

- If project cards render empty, verify `projectsData` content and ensure `repos.json` + `index.json` stay in sync; stale folders cause fetch failures logged in the console.
- Image modal paths are static (`/images/repos/${code}/filename`); broken thumbnails usually mean missing files or mismatch between `repos.json.image` and actual filenames.
- GitHub Pages needs absolute paths compatible with `BrowserRouter`; keep asset paths rooted at `/` (Vite `base` is `/`). For custom domains you may need HashRouter, but current deploy expects BrowserRouter.
- Filters/search in `ProjectsList` rely on `languages` object counts; maintain the `{ language: bytes }` shape exported by GitHub’s API when editing data manually.

Questions or missing info? Let me know which section needs examples or deeper detail and I’ll expand it.
