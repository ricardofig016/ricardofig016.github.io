# Website Architecture Outline for React Resume

## **Core Principles**

- **Project-Centric Focus**: Projects are the primary content, with detailed subpages for each.
- **Clear Navigation Hierarchy**: Intuitive paths for users to explore sections without confusion.
- **Minimalist Structure**: Avoid overcomplication, but allow depth for project details.
- **SEO-Friendly URLs**: Clean, descriptive paths for better indexing (e.g., `/projects/web-tool-internship`).

---

## **Route Structure**

1. **Homepage (`/`)**

   - **Purpose**: Immediate introduction + quick access to key sections.
   - **Content**:
     - Hero section with name, photo, short tagline (e.g., "CS Student Building Impactful Projects").
     - "Featured Projects" carousel (3–4 highlights linking to `/projects/[id]`).
     - Quick-links to "Projects", "Skills", and "Education".
     - Footer with GitHub, LinkedIn, and contact email.

2. **Projects (`/projects`)**

   - **Purpose**: Central hub to explore all projects.
   - **Structure**:
     - **Primary Page (`/projects`)**
       - Grid/card layout filtering projects by:
         - **Type**: Personal, University, Internship.
         - **Tech Stack**: Tags like React, Python, etc.
       - Search bar for project titles/descriptions.
     - **Project Subpages (`/projects/[project-id]`)**
       - Dynamic routes for deep dives.
       - Sections per project:
         - Project demo (video/gif/screenshots).
         - "Why It Matters": Relevance to education/career goals.
         - Technical challenges + skills learned.
         - GitHub link + optional "Try It Live" button.
         - "Related Projects" suggestions at the bottom.

3. **Education (`/education`)**

   - **Purpose**: Demonstrate academic foundation.
   - **Content**:
     - Degree progress (timeline bar: "3rd year, graduating in [Month/Year]").
     - Key coursework (e.g., "Algorithms, Databases, Web Dev").
     - Student nucleus involvement (brief description + contributions).
     - Awards/scholarships (if any).

4. **Skills (`/skills`)**

   - **Purpose**: Visualize technical/soft skills.
   - **Structure**:
     - **Categories**:
       - **Languages**: Python, JavaScript, etc.
       - **Frameworks**: React, Node.js.
       - **Tools**: Git, Docker.
       - **Concepts**: Agile, OOP.
     - Interactive "skill level" indicators (e.g., "Advanced" vs. "Intermediate").
     - Short examples linking to projects using each skill.

5. **Experience (`/experience`)**

   - **Purpose**: Highlight professional growth.
   - **Content**:
     - **Internship Section**:
       - Company logo + role.
       - Key contributions to the web tool (metrics if possible, e.g., "Improved load time by 30%").
       - Skills gained.
     - **Student Nucleus**:
       - Role (e.g., event organizer, tech lead).
       - Impact (e.g., "Hosted 10+ workshops for 200 students").

---

## **Navigation Flow**

- **Primary Navbar (Sticky/Top)**: Links to Home, Projects, Education, Skills, Experience, Contact.
- **Secondary Navigation**:
  - Breadcrumbs on project/education pages (e.g., "Home > Projects > Web Tool").
  - "Back to Projects" button on individual project pages.
  - Footer links to GitHub/LinkedIn on all pages.
- **URL Logic**:
  - Use React Router for dynamic routing (e.g., `projects/:id`).
  - HashRouter for GitHub Pages compatibility.

---

## **Technical Considerations**

- **Data Management**: Store project/education data in a centralized `data.js` or JSON file for easy updates.
- **Performance**: Lazy-load images/videos in project subpages.
- **SEO**: Add React Helmet for meta tags, project-specific descriptions.
- **Responsiveness**: Ensure mobile-friendly layouts (especially project grids).

---

## **Example User Journey**

1. Lands on `/` → sees hero section + clicks "Featured Project".
2. Redirected to `/projects/web-tool` → watches demo video, clicks GitHub link.
3. Uses navbar to go to `/skills` → explores React proficiency, clicks linked project example.
4. Navigates to `/contact` → sends email via `mailto:`.

This structure emphasizes your projects while maintaining clarity for recruiters to assess your education, skills, and experience.
