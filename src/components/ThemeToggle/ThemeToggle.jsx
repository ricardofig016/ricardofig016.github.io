import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";
import "@theme-toggles/react/css/InnerMoon.css";
import { InnerMoon } from "@theme-toggles/react";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const storedTheme = window.localStorage.getItem("theme");
  const initialTheme = storedTheme || "dark";
  document.documentElement.setAttribute("data-theme", initialTheme);
  if (!storedTheme) {
    window.localStorage.setItem("theme", initialTheme);
  }
  return initialTheme;
};

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={styles.div} onClick={toggleTheme}>
      <InnerMoon duration={750} toggled={theme === "light"} />
    </div>
  );
}

export default ThemeToggle;
