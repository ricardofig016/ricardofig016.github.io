import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";

function ProjectsList({ projectsData }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  // Filter projects by name/description and type if selected
  const filteredProjects = projectsData.filter((proj) => {
    const refinedSearch = search.toLowerCase().trim();
    const matchSearch =
      proj.name.toLowerCase().includes(refinedSearch) ||
      proj.description.toLowerCase().includes(refinedSearch);
    const matchType = filterType ? proj.type === filterType : true;
    return matchSearch && matchType;
  });

  return (
    <div className="projects-list">
      <h1>Projects</h1>
      <div className="filters">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Personal">Personal</option>
          <option value="University">University</option>
          <option value="Internship">Internship</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
        />
      </div>
      <div className="projects-grid">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="project-card">
            <h3>{proj.name}</h3>
            <p>Type: {proj.type}</p>
            <div className="tech-tags">
              {/* {proj.tech.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))} */}
            </div>
            <Link to={`/projects/${proj.code}`}>View Details</Link>
          </div>
        ))}
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

function Projects({ projectsData }) {
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

export default Projects;
