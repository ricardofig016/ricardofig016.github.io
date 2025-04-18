import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <h2>Contact Me</h2>
      <ul className="social-links">
        <li>
          <a href="https://github.com/ricardofig016" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/ricardo-figueiredo-ba5245235"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a href="mailto:ricardocastrofigueiredo@gmail.com">Email</a>
        </li>
        <li>
          <a href="tel:+351967381109">+351 967 381 109</a>
        </li>
      </ul>
      <p>© {new Date().getFullYear()} Ricardo Figueiredo. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
