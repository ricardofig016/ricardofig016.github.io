import { Link } from "react-router-dom"; // Remove if not using react-router-dom

function Home() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <img
            src="/assets/photo.jpg" // Replace with your photo path
            alt="Profile"
            className="hero-photo"
          />
          <h1>Ricardo Figueiredo</h1>
          <p>CS Student Building Impactful Projects</p>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <section className="featured-projects">
        <h2>Featured Projects</h2>
        <div className="carousel">
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
        </div>
      </section>
    </div>
  );
}

export default Home;
