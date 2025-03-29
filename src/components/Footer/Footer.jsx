import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>&#169; {currentYear} Ricardo Figueiredo</span>
    </footer>
  );
}

export default Footer;
