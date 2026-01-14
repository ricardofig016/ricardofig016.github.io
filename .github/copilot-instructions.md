# Copilot Instructions — homepage

Goal: Provide AI agents with essential codebase context to ship changes quickly and reliably.

## Big Picture

- **Architecture**: Single Page Application (SPA) built with **Vite + React Router v7**.
- **Layout**: `App.jsx` defines the shell (`Navbar`, `MainContent`, `Footer`).
- **Data Flow**: Purely static. Data is fetched at runtime from `public/data/`.
  - `App.jsx` preloads metadata for all repos from `public/data/repos/`.
  - `Education.jsx` fetches course data from `public/data/fcup/courses.json`.
- **Styling**: CSS Modules (`Component.module.css`) for local scoping; `src/styles.css` for globals.

## Critical Workflows

- **Local Dev**: `npm run dev` (Frontend) | `python utils/get_repos_info.py` (Data Sync).
- **Data Sync**: To update projects, edit `public/data/repos/repos.json` then run `get_repos_info.py`. This script populates `info.json` and `README.md` for each repo.
- **Build/Deploy**: `npm run build` (runs `create-404.js` post-build for GH Pages support) | `npm run deploy`.
- **Environment**: Requires `GITHUB_TOKEN` in `.env` for the Python sync script.

## Core Patterns & Conventions

- **Routing**: Nested routes in `Projects.jsx` (`/projects` for list, `/projects/:code` for detail).
- **Project Data**:
  - `info.json`: Contains GitHub stats, languages (as byte counts), and featured flags.
  - `README.md`: Fetched from GitHub and rendered using `showdown`.
- **Images**: Located in `public/images/repos/{code}/`. Reference them with absolute paths like `/images/repos/...`.
- **Components**: Follow the pattern `src/components/ComponentName/ComponentName.{jsx,module.css}`.
- **Icons**: Uses `react-icons` (Fa6).

## Developer Gotchas

- **Data Sync**: `repos.json` entries must match GitHub repository names precisely.
- **Carousel**: `react-multi-carousel` is used for image galleries; ensure responsive config matches the local layout.
- **Markdown**: Sanitize or trust `showdown` output carefully in `dangerouslySetInnerHTML`.
- **Absolute Paths**: Always use absolute paths (starting with `/`) for public assets in code.

## Key Files for Reference

- `src/App.jsx`: Global routing and data preloading logic.
- `src/pages/Projects/Projects.jsx`: Complex filtering, search logic, and markdown rendering.
- `utils/get_repos_info.py`: The "Source of Truth" generator for project data.
- `public/data/repos/repos.json`: Manually managed configuration for which projects to display.
