import styles from "./Projects.module.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "../../components/Select/Select";
import CollapsibleSection from "../../components/CollapsibleSection/CollapsibleSection";
import ImageModal from "../../components/ImageModal/ImageModal";
import TechPills from "../../components/TechPills/TechPills";
import Showdown from "showdown";
import { FaGithub, FaGlobe } from "react-icons/fa6";
import Carousel from "react-multi-carousel";

function ProjectsList({ projectsData }) {
  const navigate = useNavigate();

  // Context filter
  const [filterContext, setFilterContext] = useState("");
  const contextOptions = [
    { value: "", label: "All Contexts" },
    { value: "Personal", label: "Personal" },
    { value: "University", label: "University" },
    { value: "Internship", label: "Internship" },
  ];

  // Language filter
  // TODO: Refactor 'languages' to 'techs' to align with Experience.
  // This will also involve updating the sorting logic to match the multi-level sort used in Experience.
  const [filterLanguage, setFilterLanguage] = useState("");
  const langs = {}; // { lang: count }
  projectsData.forEach((proj) => {
    Object.keys(proj.languages || {}).forEach((lang) => {
      langs[lang] = (langs[lang] || 0) + 1;
    });
  });
  const languageOptions = [{ value: "", label: "All Languages" }];
  Object.keys(langs)
    .map((lang) => ({ value: lang, label: lang }))
    .sort((a, b) => langs[b.value] - langs[a.value])
    .forEach((lang) => languageOptions.push(lang));

  // Skill filter
  // TBA

  // Search
  const [search, setSearch] = useState("");

  const getSortedLanguages = (languages) => {
    return Object.keys(languages || {}).sort((a, b) => languages[b] - languages[a]);
  };

  // Filter projects by name/description/langs/readme and selected filters and sort them
  const filteredProjects = (() => {
    const refinedSearch = search.toLowerCase().trim();

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

      return -1; // no match
    };

    return projectsData
      .map((proj) => ({ proj, rank: rankProject(proj) }))
      .filter(({ rank }) => rank >= 0) // keep only matched
      .filter(({ proj }) => (filterContext ? proj.context === filterContext : true))
      .filter(({ proj }) => (filterLanguage ? proj.languages && proj.languages[filterLanguage] : true))
      .sort((a, b) => {
        // primary: rank
        if (a.rank !== b.rank) return a.rank - b.rank;
        // default: leave as is (original order)
        return 0;
      })
      .map(({ proj }) => proj);
  })();

  return (
    <div>
      <h1>Projects</h1>
      <div className={styles.filters}>
        {/* Context */}
        <Select options={contextOptions} value={filterContext} onChange={(v) => setFilterContext(v)} placeholder="All Contexts" id="projects-context-select" />

        {/* Languages */}
        <Select options={languageOptions} value={filterLanguage} onChange={(v) => setFilterLanguage(v)} placeholder="All Languages" id="projects-language-select" />

        {/* Skills */}
        {/* TBA */}

        {/* Search */}
        <input className={styles.searchInput} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools, frameworks, projects..." />
      </div>

      <div>
        {filteredProjects.map((proj) => {
          const langs = getSortedLanguages(proj.languages);
          return (
            <div key={proj.id ?? proj.code} className={styles.projectCard} tabIndex="0" role="link" onClick={() => navigate(`/projects/${proj.code}`)}>
              {/* Title */}
              <h3 className={styles.projectTitle}>{proj.name + " "}</h3>

              {/* Tech Tags */}
              <TechPills technologies={langs} size="small" className={styles.projectTechTags} />

              {/* Actions */}
              <div>
                {proj.github_url && (
                  <a className={styles.projectGithubLink} href={proj.github_url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${proj.name} on GitHub`}>
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

  // Header
  const headerSection = (
    <section className={styles.projectHeader}>
      <h1>{project.name}</h1>
      <TechPills technologies={project.languages ? Object.keys(project.languages) : []} className={styles.projectHeaderTech} />
      <p>{project.description}</p>
    </section>
  );

  // Images
  const carouselItems = (project.images || []).map((image) => <ImageModal className={styles.carouselItem} key={image} src={`/images/repos/${project.code}/${image}`} alt={project.name} />);
  const imagesSection = project.images && project.images.length > 0 && (
    <section className={styles.projectImages}>
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={true}
        responsive={{
          all: {
            breakpoint: { max: 5000, min: 0 },
            items: 2,
            slidesToSlide: 1,
          },
        }}
        ssr={true} // render carousel on server-side.
        infinite={true}
        // autoPlay={true}
        autoPlaySpeed={5000}
        keyBoardControl={true}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        className={styles.carousel}
      >
        {carouselItems}
      </Carousel>
    </section>
  );

  // Links
  const linksSection = (project.github_url || project.website) && (
    <CollapsibleSection title="Links">
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
    </CollapsibleSection>
  );

  // ReadMe
  const readmeSection = project.readmeHtml && (
    <CollapsibleSection title="ReadMe" defaultOpen={false}>
      <span className={styles.sectionParagraph}>
        Read this on{" "}
        <a href={project.github_url + "#readme"} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </span>
      <div dangerouslySetInnerHTML={{ __html: project.readmeHtml }} className={styles.projectReadme} />
    </CollapsibleSection>
  );

  // What I Learned
  const whatILearnedSection = project.whatILearned && <CollapsibleSection title="What I Learned">{project.whatILearned}</CollapsibleSection>;

  // Related Projects
  const relatedSection = project.related && project.related.length > 0 && (
    <CollapsibleSection title="Related Projects">
      <ul>
        {project.related.map((code) => {
          const relatedProject = projectsData.find((p) => p.code === code);
          return (
            <li key={code}>
              <Link to={`/projects/${code}`}>{relatedProject ? relatedProject.title : `Project ${code}`}</Link>
            </li>
          );
        })}
      </ul>
    </CollapsibleSection>
  );

  return (
    <div>
      {headerSection}
      {imagesSection}
      {linksSection}
      {readmeSection}
      {whatILearnedSection}
      {relatedSection}
    </div>
  );
}
Project.propTypes = {
  projectsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function Projects({ projectsData }) {
  const projectEntries = Object.values(projectsData || {});

  return (
    <Routes>
      <Route path="/" element={<ProjectsList projectsData={projectEntries} />} />
      <Route path=":projectCode" element={<Project projectsData={projectEntries} />} />
    </Routes>
  );
}
Projects.propTypes = {
  projectsData: PropTypes.objectOf(PropTypes.object).isRequired,
};
