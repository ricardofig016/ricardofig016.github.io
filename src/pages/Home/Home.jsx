import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import PropTypes from "prop-types";
import { contactLinks } from "../../constants/contactLinks";
import { FaDownload, FaLocationDot } from "react-icons/fa6";
import { formatDate } from "../../utils/dateUtils";
import TechPills from "../../components/TechPills/TechPills";
import TechStack from "../../components/TechStack/TechStack";
import { getExperienceTechnologies } from "../../utils/techMerger";
import Carousel from "../../components/Carousel/Carousel";

function Home({ featuredProjectsData, experiencesData, projectsData, techData }) {
  const featuredProjectEntries = Object.entries(featuredProjectsData || {});
  const experiences = Object.values(experiencesData || {});

  const carouselItems = featuredProjectEntries.map(([, project]) => {
    // Image
    const projectImagesBasePath = `/data/projects/${project.code}/images/`;
    const imageUrl = project.image ? `${projectImagesBasePath}${project.image}` : null;

    const item = (
      <Link to={`/projects/${project.code}`} key={project.code} className={styles.featuredProjectLink}>
        <div className={styles.projectCard}>
          <div className={styles.projectCardBody}>
            <h3>{project.name}</h3>
            <TechPills technologies={project.technologies || []} size="small" />
            <p>{project.description}</p>
          </div>
          {imageUrl && (
            <div className={styles.projectMedia}>
              <img src={imageUrl} alt={project.name} />
            </div>
          )}
        </div>
      </Link>
    );
    return item;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src="/images/profile_photo.png" alt="Profile" />
        <div className={styles.heroText}>
          <h1>Ricardo Figueiredo</h1>
          <div>
            <p>Fullstack Developer</p>
            <p>Building Software & Learning Every Day</p>
          </div>
          <p className={styles.location}>
            <a
              href="https://www.google.com/maps?q=Oliveira+de+Azemeis+Portugal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Google Maps for Oliveira de Azeméis, Portugal"
              className="outink"
            >
              <FaLocationDot aria-hidden="true" />
              <span>Oliveira de Azeméis, Portugal</span>
            </a>
          </p>
          <div className={styles.heroActions}>
            <a className={styles.resumeButton} href="/documents/resume.pdf" download="Ricardo-Figueiredo-Full-Stack-Developer.pdf">
              <FaDownload aria-hidden="true" />
              <span>Download Resume</span>
            </a>
            <ul className={styles.heroContacts}>
              {contactLinks.map(({ id, href, icon: Icon, label, text, external }) => {
                const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
                return (
                  <li key={id}>
                    <a href={href} {...externalProps}>
                      <Icon aria-hidden="true" />
                      <span>{text || label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className={styles.experienceSection}>
        <h2>Experience</h2>
        <div className={styles.experienceList}>
          {experiences
            .sort((a, b) => {
              const dateA = new Date(a.start_date.split("-").reverse().join("-"));
              const dateB = new Date(b.start_date.split("-").reverse().join("-"));
              return dateB - dateA;
            })
            .map((exp) => {
              const technologies = getExperienceTechnologies(exp, projectsData);
              return (
                <Link key={exp.code} to={`/experience/${exp.code}`} className={styles.experienceItem}>
                  <div className={styles.expDot} />
                  <div className={styles.expContent}>
                    <h3 className={styles.expTitle}>
                      {exp.role} @ <span className={styles.expCompany}>{exp.company}</span>
                    </h3>
                    <span className={styles.expDate}>
                      {formatDate(exp.start_date)} — {exp.ongoing ? "Present" : formatDate(exp.end_date)}
                    </span>
                    <TechPills technologies={technologies} size="small" className={styles.homeExpTech} />
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        {featuredProjectEntries.length > 0 ? (
          <Carousel ariaLabel="Featured projects" className={styles.carousel} slideClassName={styles.carouselSlide} contentClassName={styles.carouselContent}>
            {carouselItems}
          </Carousel>
        ) : (
          <p>No featured projects yet.</p>
        )}
      </section>

      {/* Tech Stack */}
      <section className={styles.techSection}>
        <h2>Tech Stack</h2>
        {techData && techData.length > 0 ? <TechStack techData={techData} /> : <p>Loading technologies...</p>}
      </section>
    </div>
  );
}

Home.propTypes = {
  // { [code: string]: { ...projectData } }
  featuredProjectsData: PropTypes.objectOf(PropTypes.object).isRequired,
  experiencesData: PropTypes.objectOf(PropTypes.object),
  projectsData: PropTypes.objectOf(PropTypes.object).isRequired,
  techData: PropTypes.arrayOf(PropTypes.object),
};

export default Home;
