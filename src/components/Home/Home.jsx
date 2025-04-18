import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Home.module.css";
import PropTypes from "prop-types";

function Home({ featuredProjects }) {
  const carouselItems = featuredProjects.map((project) => (
    <div className="carousel-item" key={project.name}>
      <Link to={`/projects/${project.code}`}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </Link>
    </div>
  ));

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
      autoPlay={false}
      keyBoardControl={true}
      containerClass="carousel-container"
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      {carouselItems}
    </Carousel>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <img src="/images/profile_photo.jpg" alt="Profile" />
        <div>
          <h1>Ricardo Figueiredo</h1>
          <p>CS Student Building Impactful Projects</p>
        </div>
      </section>
      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        {carouselElement}
      </section>
    </div>
  );
}

Home.propTypes = {
  featuredProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Home;
