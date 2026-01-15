# Copilot Instructions — homepage

Goal: Provide AI agents with essential codebase context to ship changes quickly and reliably.

## Big Picture

- **Architecture**: Single Page Application (SPA) built with **Vite + React Router v7**.
- **Layout**: `App.jsx` defines the shell (`Navbar`, `MainContent`, `Footer`).
- **Data Flow**: Static site architecture. Data is fetched at runtime from `public/data/` using `fetch`.
  - `App.jsx` preloads metadata for all repos from `public/data/repos/` and experiences from `public/data/experience/`.
  - Content is organized into folders with a standard structure: `index.json` (listing folders), `[folder]/info.json` (metadata), and `[folder]/README.md` (detailed content).
- **Styling**: CSS Modules (`Component.module.css`) for local scoping; `src/styles.css` for globals.
- **UI Libraries**: Uses **Material UI (MUI)** for some components, **PrimeReact** for interactive elements like `Carousel`, and **react-icons** (Font Awesome 6 - `Fa6`) for icons.

## Critical Workflows

- **Frontend Development**: `npm run dev` (Vite dev server).
- **Project Data Sync**:
  1. Add/edit entries in [public/data/repos/repos.json](public/data/repos/repos.json).
  2. Run `python utils/get_repos_info.py` (requires `GITHUB_TOKEN` in `.env`). This populates `public/data/repos/` and `public/images/repos/`.
- **Education Data Sync**:
  1. Run `python utils/scrape_sigarra.py` to fetch raw HTML content.
  2. Run `python utils/summarize_courses.py` (requires `OPENAI_API_KEY`) to generate structured topics.
- **Build & Deploy**:
  - `npm run build`: Runs production build and `node scripts/create-404.js` for GH Pages SPA support (copies `index.html` to `404.html`).
  - `npm run deploy`: Executes `gh-pages -d dist`.

## Core Patterns & Conventions

- **Routing**:
  - Nested routes for Projects ([src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx)) and Experience ([src/pages/Experience/Experience.jsx](src/pages/Experience/Experience.jsx)).
  - Pattern: `/:category` for list view, `/:category/:code` for detail view.
- **Component Structure**: `src/components/ComponentName/ComponentName.{jsx,module.css}`.
- **Data Management**:
  - Metadata in `info.json` includes IDs, descriptions, and tech stacks (byte counts for languages in repos).
  - Use [src/utils/dateUtils.js](src/utils/dateUtils.js) (specifically `formatDate`) for consistent date presentation.
- **Markdown Rendering**: Render project/experience READMEs using **Showdown** in detail views.
- **Search & Filtering**:
  - Implement content ranking for search (Exact name match > Description > Tags > Readme content).
  - Multi-level sorting for tech filters based on frequency across the dataset.

## Key Files for Reference

- [src/App.jsx](src/App.jsx): Global routing and centralized data fetching logic.
- [src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx): Search, filtering, and markdown rendering architecture.
- [src/pages/Experience/Experience.jsx](src/pages/Experience/Experience.jsx): Career history rendering with related project links.
- [utils/get_repos_info.py](utils/get_repos_info.py): Primary automation script for repository data aggregation.
- [scripts/create-404.js](scripts/create-404.js): Post-build script facilitating SPA routing on GitHub Pages.
