import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <h2>Contact Me</h2>
      <ul className="social-links">
        <li>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="mailto:your.email@example.com">Email</a>
        </li>
      </ul>
      <p>© {new Date().getFullYear()} Ricardo Figueiredo. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
