# Copilot Instructions — homepage

Goal: Provide AI agents with essential codebase context to ship changes quickly and reliably.

## Big Picture

- **Architecture**: Single Page Application (SPA) built with **Vite + React Router v7**.
- **Layout**: `App.jsx` defines the shell (`Navbar`, `MainContent`, `Footer`) and handles all data fetching centrally.
- **Data Flow**: Static site architecture. Data is fetched at runtime from `public/data/` using `fetch`.
  - `App.jsx` preloads all metadata for projects and experiences on mount, passing data down as props.
  - Content structure: `index.json` (array of folder names) → `[folder]/info.json` (metadata) → `[folder]/README.md` (detailed content, projects only).
  - Projects and experiences each maintain separate data structures with different schemas.
- **Styling**: CSS Modules (`Component.module.css`) for component scoping; `src/styles.css` for global styles.
- **UI Libraries**: **Material UI (MUI)** for base components, **PrimeReact** for `Carousel`, **react-multi-carousel** for project images, **Showdown** for markdown rendering, and **react-icons** (Font Awesome 6 - `Fa6`) for icons.

## Critical Workflows

- **Frontend Development**: `npm run dev` starts Vite dev server.
- **Project Data Sync** (requires GitHub PAT in `.env` as `GITHUB_TOKEN`):
  1. Add/edit project entries in [public/data/projects/projects.json](public/data/projects/projects.json).
  2. Run `python utils/get_projects_info.py` to:
     - Fetch README.md from each repo
     - Pull general metadata (description, stars, forks, issues, URLs)
     - Extract project name from README's first `# ` heading
     - Generate `info.json` with combined metadata + manual tags from `projects.json`
     - Populate `public/data/projects/[code]/` folders and `public/data/projects/[code]/images/` structure
- **Education Data Sync** (requires OpenAI API key in `.env` as `OPENAI_API_KEY`):
  1. Run `python utils/scrape_sigarra.py` to fetch raw HTML from university portal.
  2. Run `python utils/summarize_courses.py` to generate structured course topics using LLM.
- **Build & Deploy**:
  - `npm run build`: Builds production bundle, then runs `postbuild` hook to execute `node scripts/create-404.js`.
  - `scripts/create-404.js`: Copies `dist/index.html` → `dist/404.html` for GitHub Pages SPA routing support.
  - `npm run deploy`: Builds and deploys to `gh-pages` branch using `gh-pages -d dist`.

## Core Patterns & Conventions

- **Routing**:
  - Nested routes for Projects ([src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx)) and Experience ([src/pages/Experience/Experience.jsx](src/pages/Experience/Experience.jsx)).
  - Pattern: `/:category` for list view, `/:category/:code` for detail view.
  - `ScrollToTop` component in App.jsx ensures page scrolls to top on route change.
- **Component Structure**: `src/components/ComponentName/ComponentName.{jsx,module.css}`.
- **Data Management**:
  - **Projects schema**: Manually maintained `projects.json` contains `featured`, `image`, `context`, `technologies`. Script merges this with GitHub API data.
  - **Experience schema**: `info.json` includes `role`, `level`, `type`, `arrangement`, `company`, `supervisors`, dates (`MM-YYYY` format), `location`, `highlights`, `projects` (array of project codes), `technologies`.
  - Date format: Store as `"MM-YYYY"` strings, display using `formatDate()` from [src/utils/dateUtils.js](src/utils/dateUtils.js) which converts to `"Month YYYY"` (e.g., `"01-2024"` → `"Jan 2024"`).
  - Technologies: Array of lowercase strings representing tech stack (languages, frameworks, tools).
- **Markdown & Text Rendering**:
  - Project READMEs: Use **Showdown** converter (`new Showdown.Converter()`) to render GitHub markdown as HTML.
  - Experience highlights: Custom `renderHighlight()` function parses `**text**` as bold spans (lighter styling).
- **Search & Filtering Algorithm**:
  - **Search ranking** (lower rank = higher priority):
    - 0: Exact match in project/experience name
    - 1: Match in description
    - 2: Match in technologies array
    - 3: Match in README content
  - **Tech filter sorting** (multi-level):
    1. Frequency across dataset (descending)
    2. Lowest appearance order in any item's tech array (ascending)
    3. Alphabetical (ascending)
- **Reusable Components**:
  - `TechPills`: Renders tech stack as styled pill badges. Accepts `size="small"` prop.
  - `CollapsibleSection`: Accordion-style section with title and `defaultOpen` prop.
  - `Select`: Custom dropdown component for filters.
  - `ImageModal`: Clickable thumbnail that opens fullscreen modal.
- **Cross-References**:
  - Experience entries link to related projects via `projects` array (project codes).
  - Detail pages use `react-router-dom`'s `Link` component for internal navigation.

## Key Files for Reference

- [src/App.jsx](src/App.jsx): Global routing and centralized data fetching logic.
- [src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx): Search, filtering, and markdown rendering architecture.
- [src/pages/Experience/Experience.jsx](src/pages/Experience/Experience.jsx): Career history rendering with related project links.
- [utils/get_projects_info.py](utils/get_projects_info.py): Primary automation script for repository data aggregation.
- [scripts/create-404.js](scripts/create-404.js): Post-build script facilitating SPA routing on GitHub Pages.
