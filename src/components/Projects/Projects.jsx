import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

// Example projects data. In a real app, you might fetch this from an API.
const projectsData = [
  {
    id: "1",
    title: "Personal Project One",
    type: "Personal",
    tech: ["React", "CSS"],
    description: "Brief description of Project One.",
    demo: "demo1.mp4",
    whyItMatters: "This project showcases my personal creativity and technical skills.",
    challenges: "Learned state management and API integration.",
    github: "https://github.com/yourusername/project-one",
    live: "https://projectone.example.com",
    related: ["2", "3"],
  },
  {
    id: "2",
    title: "University Project Two",
    type: "University",
    tech: ["Python", "Django"],
    description: "Brief description of Project Two.",
    demo: "demo2.png",
    whyItMatters: "Demonstrated academic research in web development.",
    challenges: "Dealt with database optimization and security.",
    github: "https://github.com/yourusername/project-two",
    live: "",
    related: ["1"],
  },
  // Add more projects as needed.
];

function ProjectsList() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  // Filter projects by title/description and type if selected
  const filteredProjects = projectsData.filter((proj) => {
    const matchSearch =
      proj.title.toLowerCase().includes(search.toLowerCase()) ||
      proj.description.toLowerCase().includes(search.toLowerCase());
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
            <h3>{proj.title}</h3>
            <p>Type: {proj.type}</p>
            <div className="tech-tags">
              {proj.tech.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
            <Link to={`/projects/${proj.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail() {
  const { projectId } = useParams();
  const project = projectsData.find((proj) => proj.id === projectId);
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="project-detail">
      <h1>{project.title}</h1>
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
      <section className="related-projects">
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
      </section>
    </div>
  );
}

function Projects() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList />} />
      <Route path=":projectId" element={<ProjectDetail />} />
    </Routes>
  );
}

export default Projects;
