import styles from "./Projects.module.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "../Select/Select";

function ProjectsList({ projectsData }) {
  const [search, setSearch] = useState("");
  const [filterContext, setFilterContext] = useState("");
  const navigate = useNavigate();

  const contextOptions = [
    { value: "", label: "All Contexts" },
    { value: "Personal", label: "Personal" },
    { value: "University", label: "University" },
    { value: "Internship", label: "Internship" },
  ];

  const getSortedLanguages = (languages) => {
    return Object.keys(languages || {}).sort((a, b) => languages[b] - languages[a]);
  };

  // Filter projects by name/description and context if selected
  const filteredProjects = projectsData.filter((proj) => {
    const refinedSearch = search.toLowerCase().trim();
    const matchSearch =
      (proj.name || "").toLowerCase().includes(refinedSearch) ||
      (proj.description || "").toLowerCase().includes(refinedSearch) ||
      getSortedLanguages(proj.languages).some((lang) => lang.toLowerCase().includes(refinedSearch));
    const matchContext = filterContext ? proj.context === filterContext : true;
    return matchSearch && matchContext;
  });

  return (
    <div className="projects-list">
      <h1>Projects</h1>
      <div className={styles.filters}>
        <Select
          options={contextOptions}
          value={filterContext}
          onChange={(v) => setFilterContext(v)}
          placeholder="All Contexts"
          id="project-context-select"
        />
        <input
          className={styles.searchInput}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
        />
      </div>

      <div className="projects-grid">
        {filteredProjects.map((proj) => {
          const langs = getSortedLanguages(proj.languages);
          return (
            <div
              key={proj.id ?? proj.code}
              className={styles.projectCard}
              tabIndex="0"
              role="link"
              onClick={() => navigate(`/projects/${proj.code}`)}
            >
              <Link to={`/projects/${proj.code}`}></Link>
              {/* Title */}
              <h3 className={styles.projectTitle}>{proj.name + " "}</h3>

              {/* Tech Tags */}
              {langs.length > 0 && (
                <div className={styles.projectTechTags}>
                  {langs.map((lang, i, arr) => (
                    <span key={lang} className="tech-tag">
                      {lang}
                      {i < arr.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="project-actions">
                {proj.url && (
                  <a
                    className={styles.projectGithubLink}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${proj.name} on GitHub`}
                  >
                    GitHub Repo
                  </a>
                )}
              </div>

              {/* Description */}
              {proj.description && <p className={styles.projectDesc}>{proj.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
ProjectsList.propTypes = {
  projectsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function ProjectDetail({ projectsData }) {
  const { projectCode } = useParams();
  const project = projectsData.find((proj) => proj.code === projectCode);
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="project-detail">
      <h1>{project.name}</h1>
      <div className="project-demo">
        {/* Project demo: video, gif, or screenshots */}
        <p>Demo placeholder: {project.demo}</p>
      </div>
      <section className="project-info">
        <h2>Why It Matters</h2>
        <p>{project.whyItMatters}</p>
      </section>
      <section className="project-challenges">
        <h2>Technical Challenges &amp; Skills Learned</h2>
        <p>{project.challenges}</p>
      </section>
      <section className="project-links">
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer">
            Try It Live
          </a>
        )}
      </section>
      {/* <section className="related-projects">
        <h2>Related Projects</h2>
        <ul>
          {project.related.map((relatedId) => {
            const relatedProject = projectsData.find((p) => p.id === relatedId);
            return (
              <li key={relatedId}>
                <Link to={`/projects/${relatedId}`}>
                  {relatedProject ? relatedProject.title : `Project ${relatedId}`}
                </Link>
              </li>
            );
          })}
        </ul>
      </section> */}
    </div>
  );
}
ProjectDetail.propTypes = {
  projectsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function Projects({ projectsData }) {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList projectsData={projectsData} />} />
      <Route path=":projectCode" element={<ProjectDetail projectsData={projectsData} />} />
    </Routes>
  );
}
Projects.propTypes = {
  projectsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};
