import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Home.module.css";
import PropTypes from "prop-types";

function Home({ featuredProjectsData }) {
  const featuredProjectEntries = Object.entries(featuredProjectsData || {});

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
  );

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src="/images/profile_photo.jpg" alt="Profile" />
        <div className={styles.heroText}>
          <h1>Ricardo Figueiredo</h1>
          <div>
            <p>CS Student </p>
            <p>Building Software & Learning Every Day</p>
          </div>
          <a href="/documents/resume.pdf" download="Ricardo_Figueiredo.pdf">
            Download Resume
          </a>
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
};

export default Home;
