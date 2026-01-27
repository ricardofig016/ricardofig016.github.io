import styles from "./TechPills.module.css";
import PropTypes from "prop-types";

const TechPills = ({ technologies, size = "medium", className, onTechClick }) => {
  if (!technologies || technologies.length === 0) return null;

  const handleClick = (tech, e) => {
    if (onTechClick) {
      e.stopPropagation();
      onTechClick(tech);
    }
  };

  return (
    <div className={`${styles.techList} ${styles[size] || ""} ${className || ""}`}>
      {technologies.map((tech) => (
        <span
          key={tech}
          className={`${styles.techItem} ${onTechClick ? styles.clickable : ""}`}
          onClick={(e) => handleClick(tech, e)}
          role={onTechClick ? "button" : undefined}
          tabIndex={onTechClick ? 0 : undefined}
          onKeyDown={onTechClick ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick(tech, e);
            }
          } : undefined}
        >
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
  onTechClick: PropTypes.func,
};

export default TechPills;
