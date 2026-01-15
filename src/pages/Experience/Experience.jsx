import styles from "./Experience.module.css";
import { Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import CollapsibleSection from "../../components/CollapsibleSection/CollapsibleSection";
import TechPills from "../../components/TechPills/TechPills";
import Select from "../../components/Select/Select";
import { FaLinkedin, FaGlobe, FaLocationDot, FaCalendarDays, FaUserTie } from "react-icons/fa6";
import { formatDate } from "../../utils/dateUtils";

const renderHighlight = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className={styles.highlightText}>
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

function ExperienceList({ experiencesData }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterTech, setFilterTech] = useState("");

  const techStats = {}; // { tech: { count: number, minOrder: number } }
  experiencesData.forEach((exp) => {
    (exp.technologies || []).forEach((tech, index) => {
      if (!techStats[tech]) {
        techStats[tech] = { count: 0, minOrder: index };
      }
      techStats[tech].count += 1;
      if (index < techStats[tech].minOrder) {
        techStats[tech].minOrder = index;
      }
    });
  });

  const techOptions = [
    { value: "", label: "All Technologies" },
    ...Object.keys(techStats)
      .sort((a, b) => {
        // 1. Sort by frequency (descending)
        if (techStats[b].count !== techStats[a].count) {
          return techStats[b].count - techStats[a].count;
        }
        // 2. Sort by lowest appearance order (ascending)
        if (techStats[a].minOrder !== techStats[b].minOrder) {
          return techStats[a].minOrder - techStats[b].minOrder;
        }
        // 3. Alphabetical tie-breaker
        return a.localeCompare(b);
      })
      .map((tech) => ({ value: tech, label: tech })),
  ];

  const filteredExperiences = experiencesData.filter((exp) => {
    const matchesSearch = exp.company.toLowerCase().includes(search.toLowerCase()) || exp.role.toLowerCase().includes(search.toLowerCase()) || (exp.technologies || []).some((t) => t.toLowerCase().includes(search.toLowerCase())) || (exp.highlights || []).some((h) => h.toLowerCase().includes(search.toLowerCase()));

    const matchesTech = filterTech ? (exp.technologies || []).includes(filterTech) : true;

    return matchesSearch && matchesTech;
  });

  return (
    <div>
      <h1>Experience</h1>

      <div className={styles.filters}>
        <Select options={techOptions} value={filterTech} onChange={(v) => setFilterTech(v)} placeholder="All Technologies" id="experience-tech-select" />
        <input className={styles.searchInput} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies, roles, techs..." />
      </div>

      <div>
        {filteredExperiences.map((exp) => (
          <div key={exp.code} className={styles.experienceCard} tabIndex="0" role="link" onClick={() => navigate(`/experience/${exp.code}`)}>
            <div className={styles.expCardContent}>
              {exp.company_logo && <img src={`/data/experience/${exp.code}/${exp.company_logo}`} alt={`${exp.company} logo`} className={styles.expCardLogo} />}
              <div className={styles.expCardText}>
                <div className={styles.expHeader}>
                  <h3 className={styles.expCompany}>{exp.company}</h3>
                  <span className={styles.expDates}>
                    <FaCalendarDays className={styles.icon} /> {formatDate(exp.start_date)} - {exp.ongoing ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className={styles.expSubHeader}>
                  <span className={styles.expRole}>{exp.role}</span>
                  <span className={styles.expLocation}>
                    <FaLocationDot className={styles.icon} /> {exp.location.city}, {exp.location.country}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.expDetails}>
              <span>{exp.level}</span>
              <span> | </span>
              <span>{exp.type}</span>
              <span> | </span>
              <span>{exp.arrangement}</span>
            </div>
            <TechPills technologies={exp.technologies} size="small" className={styles.expTechTags} />
            {exp.highlights && exp.highlights.length > 0 && (
              <ul className={styles.expHighlightsPreview}>
                {exp.highlights.map((highlight, i) => (
                  <li key={i}>{renderHighlight(highlight)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

ExperienceList.propTypes = {
  experiencesData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function ExperienceDetail({ experiencesData, projectsData }) {
  const { experienceCode } = useParams();
  const exp = experiencesData.find((e) => e.code === experienceCode);

  if (!exp) return <div>404: Experience {experienceCode} not found.</div>;

  const projects = Object.values(projectsData || {});

  return (
    <div>
      <section className={styles.expHeaderLarge}>
        <div className={styles.expTitleContainer}>
          {exp.company_logo && <img src={`/data/experience/${exp.code}/${exp.company_logo}`} alt={`${exp.company} logo`} className={styles.expLogo} />}
          <div className={styles.expTitleText}>
            <div className={styles.companyTitleRow}>
              <h1>{exp.company}</h1>
              <div className={styles.companyIcons}>
                {exp.company_website && (
                  <a href={exp.company_website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <FaGlobe />
                  </a>
                )}
                {exp.company_linkedin && (
                  <a href={exp.company_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
            <h2>{exp.role}</h2>
          </div>
        </div>

        <div className={styles.expMetadata}>
          <span>
            <FaCalendarDays className={styles.icon} /> {formatDate(exp.start_date)} - {exp.ongoing ? "Present" : formatDate(exp.end_date)}
          </span>
          <span>
            <FaLocationDot className={styles.icon} /> {exp.location.city}, {exp.location.country}
          </span>
        </div>
        <div className={styles.expTypeInfo}>
          <span>{exp.level}</span> | <span>{exp.type}</span> | <span>{exp.arrangement}</span>
        </div>
        <TechPills technologies={exp.technologies} className={styles.techListHeader} />
      </section>

      {exp.projects && exp.projects.length > 0 && (
        <section className={styles.relatedProjectsSection}>
          <h2 className={styles.relatedProjectTitle}>Related Projects</h2>
          <div className={styles.relatedProjectsGrid}>
            {exp.projects.map((projCode) => {
              const project = projects.find((p) => p.code === projCode);
              return (
                <Link key={projCode} to={`/projects/${projCode}`} className={styles.relatedProjectCard}>
                  <h3>{project ? project.name : projCode}</h3>
                  {project && project.technologies && <TechPills technologies={project.technologies} size="small" className={styles.relatedProjectTech} />}
                  {project && project.description && <p>{project.description}</p>}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {exp.highlights && exp.highlights.length > 0 && (
        <CollapsibleSection title="Highlights" defaultOpen={true}>
          <ul className={styles.highlightsList}>
            {exp.highlights.map((highlight, i) => (
              <li key={i}>{renderHighlight(highlight)}</li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {exp.supervisors && exp.supervisors.length > 0 && (
        <section className={styles.supervisorsSection}>
          <h2 className={styles.supervisorsTitle}>Supervisors</h2>
          <div className={styles.supervisorsGrid}>
            {exp.supervisors.map((sup, i) => (
              <a key={i} href={sup.linkedin} target="_blank" rel="noopener noreferrer" className={styles.supervisorCard}>
                <div className={styles.supInfo}>
                  <FaUserTie className={styles.supIcon} />
                  <div>
                    <strong>{sup.name}</strong>
                    <p>{sup.role}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

ExperienceDetail.propTypes = {
  experiencesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectsData: PropTypes.object.isRequired,
};

export default function Experience({ experiencesData, projectsData }) {
  const experiences = Object.values(experiencesData || {});

  return (
    <Routes>
      <Route path="/" element={<ExperienceList experiencesData={experiences} />} />
      <Route path=":experienceCode" element={<ExperienceDetail experiencesData={experiences} projectsData={projectsData} />} />
    </Routes>
  );
}

Experience.propTypes = {
  experiencesData: PropTypes.objectOf(PropTypes.object).isRequired,
  projectsData: PropTypes.objectOf(PropTypes.object).isRequired,
};
