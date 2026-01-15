# Copilot Instructions — homepage

Goal: Provide AI agents with essential codebase context to ship changes quickly and reliably.

## Big Picture

- **Architecture**: Single Page Application (SPA) built with **Vite + React Router v7**.
- **Layout**: `App.jsx` defines the shell (`Navbar`, `MainContent`, `Footer`).
- **Data Flow**: Purely static. Data is fetched at runtime from `public/data/` using `fetch`.
  - `App.jsx` preloads metadata for all repos from `public/data/repos/` and experiences from `public/data/experience/`.
  - `Education.jsx` fetches course data from `public/data/fcup/courses.json`.
- **Styling**: CSS Modules (`Component.module.css`) for local scoping; `src/styles.css` for globals.

## Critical Workflows

- **Frontend Development**: `npm run dev` (Vite dev server).
- **Project Data Sync**:
  1. Add/edit entries in [public/data/repos/repos.json](public/data/repos/repos.json).
  2. Run `python utils/get_repos_info.py` (requires `GITHUB_TOKEN` in `.env`). This populates [public/data/repos/](public/data/repos/) and [public/images/repos/](public/images/repos/).
- **Education Data Sync**:
  1. Run `python utils/scrape_sigarra.py` to fetch raw HTML content.
  2. Run `python utils/summarize_courses.py` (requires `OPENAI_API_KEY`) to generate structured topics.
- **Build & Deploy**:
  - `npm run build`: Runs production build and `node scripts/create-404.js` for GH Pages SPA support.
  - `npm run deploy`: Executes `gh-pages -d dist`.

## Core Patterns & Conventions

- **Routing**:
  - Nested routes for Projects ([src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx)) and Experience ([src/pages/Experience/Experience.jsx](src/pages/Experience/Experience.jsx)).
  - Pattern: `/:category` for list, `/:category/:code` for detail view.
- **Component Structure**: `src/components/ComponentName/ComponentName.{jsx,module.css}`.
- **Project Metadata**:
  - `info.json`: GitHub stats, languages (byte counts), and `featured` flags.
  - `README.md`: Rendered via `showdown` in detailed views.
- **Images**: Located in `public/images/repos/{code}/`. Use absolute paths (e.g., `/images/repos/...`).
- **Icons**: Standardize on `react-icons` (Font Awesome 6 - `Fa6`).

## Key Files for Reference

- [src/App.jsx](src/App.jsx): Global routing and centralized data fetching logic.
- [src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx): Search, filtering, and markdown rendering architecture.
- [utils/get_repos_info.py](utils/get_repos_info.py): Primary automation script for repository data aggregation.
- [public/data/repos/repos.json](public/data/repos/repos.json): Configuration file defining which GitHub repositories are tracked.
- [scripts/create-404.js](scripts/create-404.js): Post-build script facilitating SPA routing on GitHub Pages.
