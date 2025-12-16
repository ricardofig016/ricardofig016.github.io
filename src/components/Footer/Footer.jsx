import styles from "./Footer.module.css";
import { contactLinks } from "../../constants/contactLinks";

function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <h2>Contact Me</h2>
      <ul className={styles.socialLinks}>
        {contactLinks.map(({ id, href, icon: Icon, label, text, external }) => {
          const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <li key={id}>
              <a href={href} {...externalProps}>
                <Icon className={styles.icon} />
                {text || label}
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}

export default Footer;
