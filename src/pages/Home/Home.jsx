import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Home.module.css";
import PropTypes from "prop-types";
import { contactLinks } from "../../constants/contactLinks";
import { FaDownload, FaLocationDot } from "react-icons/fa6";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{2})-(\d{4})$/);
  if (!match) return dateStr;
  const [, month, year] = match;
  const monthInt = parseInt(month, 10);
  const date = new Date(year, monthInt - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

function Home({ featuredProjectsData, experiencesData }) {
  const featuredProjectEntries = Object.entries(featuredProjectsData || {});
  const experiences = Object.values(experiencesData || {});

  const carouselItems = featuredProjectEntries.map(([, project]) => {
    // Image
    const repoImagesBasePath = `/images/repos/${project.code}/`;
    const imageUrl = project.image ? `${repoImagesBasePath}${project.image}` : null;
    const imgElem = imageUrl && <img src={imageUrl} alt={project.name} />;

    const item = (
      <Link to={`/projects/${project.code}`} key={project.name}>
        <div className={styles.projectCard}>
          <h3>{project.name}</h3>
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
            <a className={styles.resumeButton} href="/documents/resume.pdf" download="Ricardo_Figueiredo.pdf">
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
