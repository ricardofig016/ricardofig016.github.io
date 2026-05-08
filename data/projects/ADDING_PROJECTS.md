# Adding a New Project to the Portfolio

This guide explains the complete process for adding a new project to the projects page.

## Overview

The project system has two layers:

1. **Manual metadata** (`projects.json`) - You define featured status, image, context, and technologies
2. **Automated data** (`info.json`) - Synced from GitHub API (description, stars, forks, license, README, etc.)

The automation script (`scripts/get_projects_info.py`) merges these layers to create the final project data and **automatically regenerates** `index.json`.

**Key point:** You only need to edit `projects.json` — the sync script handles `index.json` automatically.

## Step-by-Step Instructions

### Step 1: Add Project Entry to Manual Registry

Edit `public/data/projects/projects.json` and add a new entry:

```json
"my-project-code": {
  "featured": false,
  "image": null,
  "context": "Personal",
  "technologies": ["python", "react"]
}
```

**Required fields:**

- `featured` (boolean) - Whether to show on home page carousel (true/false)
- `image` (string or null) - Filename of main image (e.g., "1-dashboard.png") or null
- `context` (string) - One of: "Personal", "University", or "Internship"
- `technologies` (array) - List of tech stack as lowercase strings

**Notes:**

- Use kebab-case for project code (e.g., `my-awesome-project`)
- Project code must match the GitHub repository name (the repo "slug").
- Technologies should be lowercase and consistent across projects
- Image filename typically follows pattern: `1-name.png`, `2-name.png`, etc.

### Step 2: Create Project Folder Structure

Create the following directory structure:

```
public/data/projects/my-project-code/
├── images/                  (optional)
│   ├── 1-dashboard.png
│   ├── 2-features.png
│   └── 3-results.png
├── documents/               (optional)
│   ├── presentation.pdf
│   └── report.pdf
├── info.json               (auto-generated, don't edit manually)
└── README.md               (auto-generated from GitHub or manual for private projects)
```

**Adding Media:**

- Place project images in `images/` folder
- Name images with number prefix: `1-`, `2-`, `3-`, etc. (determines carousel order)
- Supported formats: `.png`, `.jpg`, `.gif`
- Place documents in `documents/` folder
- Supported formats: `.pdf` and other documents

### Step 3: Prepare GitHub Repository (Required for Public Projects)

Ensure your GitHub repository has:

- A **README.md** file
- The first heading (`# Project Name`) in README - this becomes the project name in portfolio
- Properly set description in GitHub repo settings

**Private projects** will not display a `README.md`.

### Step 4: Set Up GitHub Authentication (First Time Only)

The sync script requires GitHub API access:

1. **Create a Personal Access Token (PAT):**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a descriptive name (e.g., "Portfolio Sync")
   - Select scope: `repo` (full control of private repositories)
   - Generate and copy the token

2. **Add token to `.env`:**

   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

   Create `.env` file in the project root if it doesn't exist.

3. **Verify token access:**
   - The script will validate the token before processing
   - If validation fails, check that the token has the `repo` scope

### Step 5: Run the Sync Script

Execute the automation script:

```bash
python scripts/get_projects_info.py
```

**What the script does:**

1. Validates your GitHub token
2. Reads `projects.json` manual entries
3. For each project:
   - Fetches repository metadata from GitHub (stars, forks, issues, license, dates)
   - Fetches README.md from GitHub
   - Extracts project name from README's first `# ` heading
   - Scans your `images/` and `documents/` folders
   - Generates `info.json` with merged data
4. Updates `index.json` with correct project order

**Output:**

- `public/data/projects/my-project-code/info.json` - Generated project metadata
- `public/data/projects/my-project-code/README.md` - Fetched from GitHub (or uses existing for private projects)
- Validation messages in console

### Step 6: Start Development Server (Optional)

If you want to verify before deploying:

```bash
npm run dev
```

Navigate to http://localhost:5173/projects to see your new project.

## Data Schema Reference

**Generated `info.json` structure:**

```json
{
  "id": 5,
  "code": "my-project-code",
  "name": "My Project Name",
  "featured": true,
  "image": "1-dashboard.png",
  "context": "Personal",
  "technologies": ["python", "react"],
  "github_url": "https://github.com/ricardofig016/my-project-code",
  "description": "Project description from GitHub",
  "stars": 42,
  "forks": 5,
  "issues": 2,
  "license": "MIT",
  "size": 12345,
  "private": false,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-02-20T14:45:00Z",
  "commit_count": 156,
  "images": ["1-dashboard.png", "2-features.png"],
  "documents": ["presentation.pdf"]
}
```

## Key Points

- ✅ **Only edit `projects.json`** manually — the sync script regenerates `index.json` automatically
- ✅ **Order in `projects.json`** determines display order (as the script reads keys in insertion order)
- ✅ **Featured projects** appear on the home page carousel with their main image
- ✅ **Technology array** is used for filtering and sorting on projects page
- ✅ **Context** helps visitors filter by project type
- ✅ **Images** appear in a carousel on project detail page
- ✅ **Documents** appear as downloadable links
- ✅ **Automation** keeps GitHub data in sync when you run the script

## Related Files

- `public/data/projects/projects.json` - Manual project metadata
- `public/data/projects/index.json` - Project display order
- `scripts/get_projects_info.py` - Automation script
- `src/pages/Projects/Projects.jsx` - Projects page component
