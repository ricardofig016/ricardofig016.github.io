import styles from "./TechPills.module.css";
import PropTypes from "prop-types";

const TechPills = ({ technologies, size = "medium", className }) => {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div className={`${styles.techList} ${styles[size] || ""} ${className || ""}`}>
      {technologies.map((tech) => (
        <span key={tech} className={styles.techItem}>
          {tech}
        </span>
      ))}
    </div>
  );
};

TechPills.propTypes = {
  technologies: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.oneOf(["small", "medium"]),
  className: PropTypes.string,
};

export default TechPills;
