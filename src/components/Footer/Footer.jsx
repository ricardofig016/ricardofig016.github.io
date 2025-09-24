import styles from "./Footer.module.css";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa6";

function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <h2>Contact Me</h2>
      <ul className={styles.socialLinks}>
        <li>
          <a href="https://github.com/ricardofig016" target="_blank" rel="noopener noreferrer">
            <FaGithub className={styles.icon} />
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/ricardo-figueiredo-ba5245235"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className={styles.icon} />
            LinkedIn
          </a>
        </li>
        <li>
          <a href="mailto:ricardocastrofigueiredo@gmail.com">
            <FaEnvelope className={styles.icon} />
            Email
          </a>
        </li>
        <li>
          <a href="tel:+351967381109">
            <FaPhone className={styles.icon} />
            +351 967 381 109
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
