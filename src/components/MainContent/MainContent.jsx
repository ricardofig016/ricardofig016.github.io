import styles from "./MainContent.module.css";
import PropTypes from "prop-types";

function MainContent({ children }) {
  return <div className={styles.main}>{children}</div>;
}

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContent;
