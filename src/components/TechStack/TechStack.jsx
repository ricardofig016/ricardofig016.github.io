import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./TechStack.module.css";
import { generateTechBackground } from "../../utils/colorUtils";

function TechStack({ techData }) {
  return (
    <div className={styles.techGrid}>
      {techData.map((tech) => {
        const bgColor = generateTechBackground(tech.color);
        const kebab = String(tech.code)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
        const iconPath = `/data/tech/icons/${kebab}.svg`;

        return (
          <Link key={tech.code} to={`/projects?tech=${tech.code}`} className={styles.techCard} style={{ backgroundColor: bgColor }}>
            <div className={styles.techIcon}>
              <img src={iconPath} alt={`${tech.code} logo`} />
            </div>
            <span className={styles.techCode}>{tech.code}</span>
          </Link>
        );
      })}
    </div>
  );
}

TechStack.propTypes = {
  techData: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TechStack;
