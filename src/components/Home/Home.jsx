import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Home.module.css";

function Home() {
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
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      autoPlay={false}
      keyBoardControl={true}
      containerClass="carousel-container"
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      <div className="carousel-item">
        <Link to="/projects/1">
          <h3>Project One</h3>
          <p>Short description of Project One.</p>
        </Link>
      </div>
      <div className="carousel-item">
        <Link to="/projects/2">
          <h3>Project Two</h3>
          <p>Short description of Project Two.</p>
        </Link>
      </div>
      <div className="carousel-item">
        <Link to="/projects/3">
          <h3>Project Three</h3>
          <p>Short description of Project Three.</p>
        </Link>
      </div>
      <div className="carousel-item">
        <Link to="/projects/4">
          <h3>Project Four</h3>
          <p>Short description of Project Four.</p>
        </Link>
      </div>
      <div className="carousel-item">
        <Link to="/projects/5">
          <h3>Project Five</h3>
          <p>Short description of Project Five.</p>
        </Link>
      </div>
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

export default Home;
