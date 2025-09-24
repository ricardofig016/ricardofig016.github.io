import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { Menubar } from "primereact/menubar";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const logo = <img src="/icons/owl.svg" alt="logo" className={styles.logo} />;
  const items = [
    {
      label: "Logo",
      template: () => <Link to="/">{logo}</Link>,
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
      label: "Skills",
      template: () => <Link to="/skills">Skills</Link>,
    },
    {
      label: "Experience",
      template: () => <Link to="/experience">Experience</Link>,
    },
    {
      label: "Contact",
      template: () => <a href="#contact">Contact</a>,
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
