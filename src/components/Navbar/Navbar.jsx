import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { Menubar } from "primereact/menubar";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (!el) return;
    // If it's inside a custom scroll container, attempt those first:
    const possibleScrollParents = [document.querySelector("main"), document.querySelector("[data-scroll-root]")].filter(Boolean);

    for (const sc of possibleScrollParents) {
      if (sc.contains(el)) {
        sc.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        history.replaceState(null, "", "#contact");
        return;
      }
    }
    // Fallback: window scrolling
    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", "#contact");
  };

  const items = [
    {
      label: "Logo",
      template: () => (
        <Link to="/">
          <img src="/icons/owl.svg" alt="logo" className={styles.logo} />
        </Link>
      ),
    },
    {
      label: "Experience",
      template: () => <Link to="/experience">Experience</Link>,
    },
    {
      label: "Projects",
      template: () => <Link to="/projects">Projects</Link>,
    },
    {
      label: "Education",
      template: () => <Link to="/education">Education</Link>,
    },
    {
      label: "Contact",
      command: scrollToContact,
      template: (item, options) => (
        <button type="button" onClick={(e) => options.onClick(e)} className={styles.contactButton}>
          Contact
        </button>
      ),
    },
    {
      label: "ThemeToggle",
      template: () => <ThemeToggle />,
    },
  ];

  return (
    <nav>
      <Menubar model={items} className={styles.menubar} />
    </nav>
  );
}
