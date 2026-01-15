import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Home.module.css";
import PropTypes from "prop-types";
import { contactLinks } from "../../constants/contactLinks";
import { FaDownload, FaLocationDot } from "react-icons/fa6";
import { formatDate } from "../../utils/dateUtils";
import TechPills from "../../components/TechPills/TechPills";

function Home({ featuredProjectsData, experiencesData }) {
  const featuredProjectEntries = Object.entries(featuredProjectsData || {});
  const experiences = Object.values(experiencesData || {});

  const carouselItems = featuredProjectEntries.map(([, project]) => {
    // Image
    const projectImagesBasePath = `/images/projects/${project.code}/`;
    const imageUrl = project.image ? `${projectImagesBasePath}${project.image}` : null;
    const imgElem = imageUrl && <img src={imageUrl} alt={project.name} />;

    const item = (
      <Link to={`/projects/${project.code}`} key={project.name}>
        <div className={styles.projectCard}>
          <h3>{project.name}</h3>
          <TechPills technologies={project.technologies || []} size="small" />
          <p>{project.description}</p>
          {imgElem}
        </div>
      </Link>
    );
    return item;
  });

  const carouselElement = (
    <Carousel
      swipeable={true}
      draggable={false}
      showDots={false}
      responsive={{
        all: {
          breakpoint: { max: 5000, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
      }}
      ssr={true} // render carousel on server-side.
      infinite={true}
      // autoPlay={true}
      autoPlaySpeed={5000}
      centerMode={true}
      keyBoardControl={true}
      containerClass="carousel-container"
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
      className={styles.carousel}
    >
      {carouselItems}
    </Carousel>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src="/images/profile_photo.jpg" alt="Profile" />
        <div className={styles.heroText}>
          <h1>Ricardo Figueiredo</h1>
          <div>
            <p>Fullstack Developer</p>
            <p>Building Software & Learning Every Day</p>
          </div>
          <p className={styles.location}>
            <a href="https://www.google.com/maps?q=Oliveira+de+Azemeis+Portugal" target="_blank" rel="noopener noreferrer" aria-label="Open Google Maps for Oliveira de Azeméis, Portugal" className="outink">
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
            .map((exp) => (
              <Link key={exp.code} to={`/experience/${exp.code}`} className={styles.experienceItem}>
                <div className={styles.expDot} />
                <div className={styles.expContent}>
                  <h3 className={styles.expTitle}>
                    {exp.role} @ <span className={styles.expCompany}>{exp.company}</span>
                  </h3>
                  <span className={styles.expDate}>
                    {formatDate(exp.start_date)} — {exp.ongoing ? "Present" : formatDate(exp.end_date)}
                  </span>
                  <TechPills technologies={exp.technologies} size="small" className={styles.homeExpTech} />
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        {featuredProjectEntries.length > 0 ? carouselElement : <p>No featured projects yet.</p>}
      </section>
    </div>
  );
}

Home.propTypes = {
  // { [code: string]: { ...projectData } }
  featuredProjectsData: PropTypes.objectOf(PropTypes.object).isRequired,
  experiencesData: PropTypes.objectOf(PropTypes.object),
};

export default Home;
