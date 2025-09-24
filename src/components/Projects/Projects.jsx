import styles from "./Projects.module.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "../Select/Select";
import Showdown from "showdown";
import { FaGithub, FaGlobe } from "react-icons/fa6";

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

  // Filter projects by name/description/langs/readme and context if selected and sort them
  const filteredProjects = (() => {
    const refinedSearch = search.toLowerCase().trim();

    if (!refinedSearch)
      return projectsData.filter((proj) => (filterContext ? proj.context === filterContext : true));

    // assign rank based on where the search matched (lower = better)
    const rankProject = (proj) => {
      const name = (proj.name || "").toLowerCase();
      if (name.includes(refinedSearch)) return 0;

      const desc = (proj.description || "").toLowerCase();
      if (desc.includes(refinedSearch)) return 1;

      const langs = getSortedLanguages(proj.languages).map((l) => l.toLowerCase());
      if (langs.some((l) => l.includes(refinedSearch))) return 2;

      const readme = (proj.readme || "").toLowerCase();
      if (readme.includes(refinedSearch)) return 3;

      return Number.POSITIVE_INFINITY; // no match
    };

    return projectsData
      .map((proj) => ({ proj, rank: rankProject(proj) }))
      .filter(({ rank }) => rank !== Number.POSITIVE_INFINITY)
      .filter(({ proj }) => (filterContext ? proj.context === filterContext : true))
      .sort((a, b) => {
        // primary: rank
        if (a.rank !== b.rank) return a.rank - b.rank;
        // default: leave as is (original order)
        return 0;
      })
      .map(({ proj }) => proj);
  })();

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
                {proj.github_url && (
                  <a
                    className={styles.projectGithubLink}
                    href={proj.github_url}
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

function Project({ projectsData }) {
  const { projectCode } = useParams();
  const project = projectsData.find((proj) => proj.code === projectCode);
  if (!project) return <div>404: Project {projectCode} not found.</div>;

  const converter = new Showdown.Converter();
  project.readmeHtml = project.readme ? converter.makeHtml(project.readme) : "";

  const headerSection = (
    <section className={styles.projectHeader}>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </section>
  );

  const demoSection = project.demo && (
    <section className={styles.projectSection}>
      <h2>Demo</h2>
      <div>{project.demo}</div>
    </section>
  );

  const readmeSection = project.readmeHtml && (
    <section className={styles.projectSection + " " + styles.projectReadmeSection}>
      <h2>Readme</h2>
      <div dangerouslySetInnerHTML={{ __html: project.readmeHtml }} className={styles.projectReadme} />
    </section>
  );

  const whatILearnedSection = project.whatILearned && (
    <section className={styles.projectSection}>
      <h2>What I Learned</h2>
      <p>{project.whatILearned}</p>
    </section>
  );

  const linksSection = (project.github_url || project.website) && (
    <section className={styles.projectSection}>
      <h2>Links</h2>
      <div className={styles.projectLinks}>
        {project.github_url && (
          <div className={styles.link}>
            <FaGithub />
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        )}
        {project.website && (
          <div className={styles.link}>
            <FaGlobe />
            <a href={project.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          </div>
        )}
      </div>
    </section>
  );

  const relatedSection = project.related && project.related.length > 0 && (
    <section className={styles.projectSection}>
      <h2>Related Projects</h2>
      <ul>
        {project.related.map((code) => {
          const relatedProject = projectsData.find((p) => p.code === code);
          return (
            <li key={code}>
              <Link to={`/projects/${code}`}>
                {relatedProject ? relatedProject.title : `Project ${code}`}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <div>
      {headerSection}
      {demoSection}
      {readmeSection}
      {whatILearnedSection}
      {linksSection}
      {relatedSection}
    </div>
  );
}
Project.propTypes = {
  projectsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function Projects({ projectsData }) {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList projectsData={projectsData} />} />
      <Route path=":projectCode" element={<Project projectsData={projectsData} />} />
    </Routes>
  );
}
Projects.propTypes = {
  projectsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};
