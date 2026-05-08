# Ricardo Figueiredo - Portfolio

A portfolio website built with Vite, React Router v7, and Material UI. Features a responsive design with projects, experience timeline, and education showcases.

Live at: **https://ricardofig016.github.io/**

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ (for data sync scripts)
- GitHub Personal Access Token (for project data sync)

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` with hot module reloading.

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── App.jsx                    # Main shell: routing, data fetching
├── pages/
│   ├── Home/                 # Landing page
│   ├── Projects/             # Project list/detail with search & filter
│   ├── Experience/           # Experience timeline with tech merging
│   └── Education/            # Course listing from university data
├── components/               # Reusable UI components
├── utils/                    # Helper functions (date, tech merging, etc.)
└── styles.css               # Global styles

public/data/
├── projects/
│   ├── projects.json        # Manual project metadata
│   ├── index.json           # Project order
│   └── [code]/
│       ├── info.json        # Auto-generated GitHub + manual data
│       ├── README.md        # Project details (from GitHub)
│       ├── images/          # Project screenshots
│       └── documents/       # PDFs, presentations, etc.
├── experience/
│   ├── index.json
│   └── [code]/
│       ├── info.json        # Role, company, dates, highlights
│       └── logo.png
└── education/
    └── [university]/
        └── courses.json
```

## Technology Stack

- **Frontend**: React 18, React Router v7, Vite
- **UI Libraries**: Material UI (MUI), PrimeReact, react-multi-carousel
- **Styling**: CSS Modules, global styles
- **Markdown**: Showdown for rendering
- **Icons**: react-icons (Font Awesome 6)
- **Automation**: Python scripts for data sync

## Data Architecture

The site uses a static-first approach with runtime data fetching:

### Projects

Manual `projects.json` entries are merged with live GitHub API data:

- Manual fields: `featured`, `image`, `context`, `technologies`
- GitHub data: stars, forks, issues, license, size, dates, README
- Auto-generated: `info.json` contains merged data
- File structure: `public/data/projects/[code]/images/` and `documents/`

### Experience

Calendar-based entries with company info and related projects:

- Date format: `"MM-YYYY"`
- Fields: role, level, company, location, dates, highlights
- Links to projects via `projects` array
- Company logos: `logo.png` in folder

### Education

Course data from university portals (auto-scraped and summarized):

- Stored in university-named folders
- AI-summarized using OpenAI API
- Fields: course name, topics, credits

## Data Sync Workflows

### Sync Projects from GitHub

Requires `GITHUB_TOKEN` in `.env` file (create a Personal Access Token with `repo` scope):

```bash
python scripts/get_projects_info.py
```

This script:

- Reads manual entries from `public/data/projects/projects.json`
- Fetches README, metadata, and stats from GitHub API
- Extracts project name from README heading
- Generates `info.json` with merged data
- Scans `images/` and `documents/` folders
- Updates project order in `index.json`

### Sync Education Data

Requires `OPENAI_API_KEY` in `.env`:

```bash
# Scrape course data from university portal
python scripts/scrape_sigarra.py

# Summarize courses using AI
python scripts/summarize_courses.py
```

## Adding Content

### Add a New Project

1. **Register in manual registry**:

   ```json
   // public/data/projects/projects.json
   "my-awesome-project": {
     "featured": true,
     "image": "1-hero.png",
     "context": "Personal",
     "technologies": ["react", "python", "postgresql"]
   }
   ```

2. **Run sync**:

   ```bash
   python scripts/get_projects_info.py
   ```

   This creates `info.json` and fetches from GitHub.

3. **Add media** (optional):
   - Images: `public/data/projects/my-awesome-project/images/`
   - Documents: `public/data/projects/my-awesome-project/documents/`

### Add an Experience Entry

1. **Create folder**: `public/data/experience/my-experience-code/`

2. **Create `info.json`**:

   ```json
   {
     "code": "my-company",
     "company": "My Company Inc",
     "role": "Senior Developer",
     "level": "Full-time",
     "type": "Full-time",
     "arrangement": "Remote",
     "start_date": "01-2024",
     "end_date": "12-2024",
     "ongoing": false,
     "location": { "city": "San Francisco", "country": "USA" },
     "highlights": ["Led **React** frontend redesign increasing performance by 45%.", "Mentored **2 junior developers** on best practices."],
     "projects": ["project-code-1", "project-code-2"],
     "supervisors": [
       {
         "name": "John Doe",
         "role": "Engineering Manager",
         "linkedin": "https://linkedin.com/..."
       }
     ]
   }
   ```

3. **Add logo** (optional): `logo.png` in the folder

4. **Register**: Add to `public/data/experience/index.json`

## Key Features

- **Search & Filter**: Full-text search across projects with tech filtering
- **Tech Stack Visualization**: Pills showing technologies used across experiences
- **Markdown Rendering**: GitHub-flavored markdown for project details
- **Responsive Design**: Mobile-first layout with MUI components
- **Dark Mode**: Theme toggle in navbar
- **URL Persistence**: Tech filters persist in query params
- **Image Gallery**: Carousel modal for project images
- **Date Formatting**: Consistent `MM-YYYY` → `Jan 2024` conversion

## Key Utilities

- **`dateUtils.js`**: Format dates from `"MM-YYYY"` to display format
- **`techMerger.js`**: Merge technologies from multiple projects using round-robin algorithm
- **`colorUtils.js`**: Generate colors for tech badges
- **`create-404.js`**: GitHub Pages SPA routing fix (runs in postbuild)

## Styling

- **CSS Modules**: Component-scoped styles (`Component.module.css`)
- **Global Styles**: `src/styles.css` for theme variables and base elements
- **Theme Variables**: Color and spacing via CSS custom properties
- **Responsive**: Mobile-first breakpoints using MUI's responsive utilities

## Deployment

This site is deployed to GitHub Pages at **https://ricardofig016.github.io/**

Build and deployment process:

1. Build with Vite: `npm run build`
2. Run postbuild hook: `node scripts/create-404.js` (copies `index.html` → `404.html` for SPA routing)
3. Push `dist/` to `gh-pages` branch via `npm run deploy`

The repository is synced from the homepage development folder to the `ricardofig016/ricardofig016.github.io` GitHub repository.

## Environment Variables

Create `.env` in root with:

```
GITHUB_TOKEN=your_personal_access_token
OPENAI_API_KEY=your_openai_api_key
```

- **GITHUB_TOKEN**: Required for project sync script (PAT with `repo` scope)
- **OPENAI_API_KEY**: Required for course summarization

## Troubleshooting

**Dev server not starting?**

- Clear `node_modules`: `rm -r node_modules && npm install`
- Check Node version: `node --version` (should be 16+)

**GitHub token issues?**

- Verify token has `repo` scope
- Check for expired tokens: create a new one in GitHub settings

**Build failing?**

- Run `npm run build` and check error messages
- Ensure all data files exist in `public/data/`

**Projects not showing?**

- Run `python scripts/get_projects_info.py` to sync from GitHub
- Verify project codes match in `projects.json` and folder names

## License

This project is open source. See LICENSE file for details.

## Contact

- **GitHub**: https://github.com/ricardofig016
- **Portfolio**: [ricardofig016.github.io](https://ricardofig016.github.io)
- **GitHub**: [ricardofig016](https://github.com/ricardofig016)
- **LinkedIn**: [ricardo-figueiredo](https://www.linkedin.com/in/ricardo-figueiredo-ba5245235/)

---

Built with Vite, React, and a lot of coffee
