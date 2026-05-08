# Copilot Instructions — homepage

Goal: Provide AI agents with essential codebase context to ship changes quickly and reliably.

## Big Picture

- **Architecture**: Single Page Application (SPA) built with **Vite + React Router v7**.
- **Layout**: [App.jsx](src/App.jsx) defines the shell (`Navbar`, `MainContent`, `Footer`) and handles all data fetching centrally.
- **Data Flow**: Static site architecture. Data is fetched at runtime from `public/data/` using `fetch`.
  - [App.jsx](src/App.jsx) preloads all metadata for projects and experiences on mount, passing data down as props.
  - Content structure: `index.json` (array of folder names) → `[folder]/info.json` (metadata) → `[folder]/README.md` (detailed content, projects only).
  - Projects and experiences each maintain separate data structures with different schemas.
- **Styling**: CSS Modules (`Component.module.css`) for component scoping; `src/styles.css` for global styles.
- **UI Libraries**: **Material UI (MUI)** for base components, **PrimeReact** for `Menubar`, custom scroll-snap carousel components for featured projects and project images, **Showdown** for markdown rendering, and **react-icons** (Font Awesome 6 - `Fa6`) for icons.

## Critical Workflows

- **Frontend Development**: `npm run dev` starts Vite dev server.
- **Project Data Sync** (requires GitHub PAT in `.env` as `GITHUB_TOKEN`):
  1. Edit project entries in [public/data/projects/projects.json](public/data/projects/projects.json).
  2. Run `python scripts/get_projects_info.py` to:
     - Fetch README.md from each repo
     - Pull metadata (description, stars, forks, issues, URLs) from GitHub API
     - Extract project name from README's first `# ` heading
     - Generate `info.json` with combined GitHub data + manual fields from `projects.json`
     - Populate `public/data/projects/[code]/` structure with images/ and documents/
- **Education Data Sync** (requires OpenAI API key in `.env` as `OPENAI_API_KEY`):
  1. Run `python scripts/scrape_sigarra.py` to fetch university portal HTML.
  2. Run `python scripts/summarize_courses.py` to generate structured course topics using LLM.
- **Build & Deploy**:
  - `npm run build`: Vite builds, then `postbuild` hook runs `node scripts/create-404.js`.
  - `scripts/create-404.js`: Copies `dist/index.html` → `dist/404.html` for GitHub Pages SPA routing.
  - `npm run deploy`: Builds and pushes to `gh-pages` branch.

## Core Patterns & Conventions

- **Routing**:
  - Nested routes in [Projects.jsx](src/pages/Projects/Projects.jsx) and [Experience.jsx](src/pages/Experience/Experience.jsx): `/:category` (list) and `/:category/:code` (detail).
  - `ScrollToTop` component in [App.jsx](src/App.jsx) scrolls to top on route change.
- **Data Schemas**:
  - **Projects**: Manual `projects.json` + GitHub API data merged in `info.json`. Fields: `featured`, `image`, `context`, `technologies`, GitHub metadata (stars, forks, issues, license, size, dates).
  - **Experience**: `info.json` with `role`, `level`, `type`, `arrangement`, `company`, `location` (city/country), `start_date`, `end_date`, `ongoing`, `highlights`, `projects` (array of related project codes), `supervisors`, company logos/URLs.
  - **Date Format**: Store as `"MM-YYYY"` strings; use `formatDate()` from [dateUtils.js](src/utils/dateUtils.js) to display as `"Jan 2024"`. ISO dates use `formatISODate()`.
  - **Technologies**: Lowercase strings array. Experiences merge related project techs using [techMerger.js](src/utils/techMerger.js) round-robin algorithm.
- **Search & Filtering** (both Projects and Experience):
  - **Search ranking** (lower = higher priority): name (0) > description (1) > technologies (2) > README/highlights (3).
  - **Tech filter sorting**: frequency (descending) > lowest appearance order (ascending) > alphabetical.
  - URL persistence: Tech filter updates `?tech=` query param via `setSearchParams()`.
- **Markdown & Text Rendering**:
  - Project READMEs: `new Showdown.Converter().makeHtml()` renders GitHub markdown.
  - Experience highlights: `renderHighlight()` parses `**text**` to bold spans within `<span className={styles.highlightText}>`.
- **Reusable Components**:
  - `TechPills` ([TechPills.jsx](src/components/TechPills/TechPills.jsx)): Renders tech pills. Props: `technologies`, `size="small"`, `onTechClick()` for navigation.
  - `CollapsibleSection`: Accordion with `title` and `defaultOpen` prop.
  - `Select`: Dropdown for filtering with `options`, `value`, `onChange`.
  - `ImageModal`: Clickable thumbnail opens fullscreen carousel modal.
- **Cross-References**: Experience `projects` array links to project codes; detail pages navigate via `<Link to={'/projects/' + code}>`.

## Key Implementation Details

- **Tech Merging Algorithm** ([techMerger.js](src/utils/techMerger.js)): Round-robin through indices across all project tech arrays, preserving relevance order while avoiding duplicates.
  - Example: `[[t1, t2, t3], [t4, t2]]` → `[t1, t4, t2, t3]`
- **Project List View**: Maps `Object.values(projectsData)` to convert object to array. Always verify if expecting array vs. object from [App.jsx](src/App.jsx).
- **Experience Techs**: `getExperienceTechnologies(exp, projectsData)` returns merged techs from all `exp.projects`.

## Key Files

- [src/App.jsx](src/App.jsx): Central data fetching and routing shell.
- [src/pages/Projects/Projects.jsx](src/pages/Projects/Projects.jsx): Project list/detail with search, filtering, markdown.
- [src/pages/Experience/Experience.jsx](src/pages/Experience/Experience.jsx): Experience list/detail with related projects.
- [src/utils/dateUtils.js](src/utils/dateUtils.js): `formatDate(MM-YYYY)` and `formatISODate()`.
- [src/utils/techMerger.js](src/utils/techMerger.js): `mergeTechnologies()` and `getExperienceTechnologies()`.
- [public/data/projects/projects.json](public/data/projects/projects.json): Manual project metadata merged with GitHub data.
- [scripts/get_projects_info.py](scripts/get_projects_info.py): GitHub data aggregation automation.
- [scripts/create-404.js](scripts/create-404.js): GitHub Pages SPA routing fix.
- [public/data/](public/data/): All JSON and markdown data for projects/experiences/tech.

## Project Data Script Details ([scripts/get_projects_info.py](scripts/get_projects_info.py))

This automation script syncs project metadata from GitHub with local data structures:

**Data Merge Process**:

1. Reads [public/data/projects/projects.json](public/data/projects/projects.json) (manual entries: `featured`, `image`, `context`, `technologies`)
2. For each project code, fetches from GitHub API:
   - General repo info: stars, forks, watchers, open issues, license, size, created/updated dates
   - README.md content (base64-decoded)
   - Commit count from pagination metadata
3. Extracts project name from README's first `# ` heading
4. Scans local `public/data/projects/[code]/`:
   - Images from `images/` folder
   - Documents from `documents/` folder
5. Generates `info.json` with merged fields (GitHub data overwrites empty fields from manual JSON)
6. Updates `public/data/projects/index.json` with project order

**Setup**: Create `.env` with `GITHUB_TOKEN` (PAT with `repo` scope). Script validates token access before processing.

**Result**: Type definition example from [info.json](public/data/projects/cart-algorithm-class-imbalance-evaluation/info.json):

```json
{
  "id": 0,
  "code": "project-code",
  "name": "Extracted from README",
  "featured": true,
  "image": "1-filename.png",
  "context": "Personal|University|Internship",
  "technologies": ["python", "react"],
  "github_url": "https://github.com/ricardofig016/[repo]",
  "stars": 0,
  "forks": 0,
  "issues": 0,
  "license": null,
  "size": 76395,
  "private": false,
  "created_at": "2025-03-27T14:01:23Z",
  "updated_at": "2026-01-27T12:50:48Z",
  "commit_count": 171,
  "images": ["1-filename.png", "2-filename.png"],
  "documents": ["presentation.pdf"]
}
```

## Common Development Tasks

### Adding a New Project

1. **Add to manual registry**: Edit [public/data/projects/projects.json](public/data/projects/projects.json):
   ```json
   "my-project-code": {
     "featured": false,
     "image": null,
     "context": "Personal",
     "technologies": ["python", "react"]
   }
   ```
2. **Run sync**: `python scripts/get_projects_info.py` fetches data from GitHub
3. **Add media** (optional): Place images in `public/data/projects/my-project-code/images/` and documents in `documents/`
4. **Update featured**: Re-run sync or manually edit the generated `info.json` if needed

### Adding a New Experience Entry

1. **Create folder**: `public/data/experience/[experience-code]/`
2. **Create info.json** with required fields:
   ```json
   {
     "code": "skill-and-reach",
     "company": "Skill & Reach",
     "role": "Software Developer",
     "level": "Internship",
     "type": "Full-time",
     "arrangement": "Hybrid",
     "start_date": "10-2025",
     "end_date": "12-2025",
     "ongoing": false,
     "location": { "city": "Porto", "country": "Portugal" },
     "highlights": ["Built **OSINT** pipeline using **Python** and **FastAPI**."],
     "projects": ["project-code-1", "project-code-2"],
     "supervisors": [{ "name": "Name", "role": "Title", "linkedin": "https://linkedin.com/..." }]
   }
   ```
3. **Add logo** (optional): Place `logo.png` in the folder
4. **Update index**: Add entry to [public/data/experience/index.json](public/data/experience/index.json)

### Updating Tech Stack for a Project

1. Edit [public/data/projects/projects.json](public/data/projects/projects.json) and update the `technologies` array (lowercase strings only)
2. Run `python scripts/get_projects_info.py` to regenerate `info.json` files
3. Tech will automatically filter/sort on Projects and Experience pages using sort logic (frequency → appearance order → alphabetical)

### Adding Project Images/Documents

1. Create directories if missing: `public/data/projects/[code]/images/` or `documents/`
2. Place files there (images: `.png`, `.jpg`, `.gif`; documents: `.pdf`, etc.)
3. Run `python scripts/get_projects_info.py` to scan and register files in generated `info.json`
4. Images appear in project detail carousel; documents appear as download links

### Modifying Search & Filter Behavior

- **Search ranking logic**: Edit [Projects.jsx](src/pages/Projects/Projects.jsx) in `rankProject()` function (returns 0-3 based on match location)
- **Tech sort logic**: See `techOptions` sort function in [Projects.jsx](src/pages/Projects/Projects.jsx) and [Experience.jsx](src/pages/Experience/Experience.jsx) (frequency → minOrder → alphabetical)
- **URL params**: Tech filter uses `?tech=` query param; modify via `setSearchParams()` in both components
