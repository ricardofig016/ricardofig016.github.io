import styles from "./Footer.module.css";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <h2>Contact Me</h2>
      <ul className={styles.socialLinks}>
        <li>
          <a href="https://github.com/ricardofig016" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/ricardo-figueiredo-ba5245235"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            LinkedIn
          </a>
        </li>
        <li>
          <a href="mailto:ricardocastrofigueiredo@gmail.com">
            <FaEnvelope />
            Email
          </a>
        </li>
        <li>
          <a href="tel:+351967381109">
            <FaPhone />
            +351 967 381 109
          </a>
        </li>
      </ul>
      <p>© {new Date().getFullYear()} Ricardo Figueiredo. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
