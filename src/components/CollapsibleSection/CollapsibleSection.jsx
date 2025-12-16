import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./CollapsibleSection.module.css";
import { FaAngleDown } from "react-icons/fa6";

export default function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => setOpen((o) => !o);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <section className={`${styles.section} ${open ? "" : styles.collapsed}`}>
      <h2
        className={styles.sectionTitle}
        onClick={toggle}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        <span>{title}</span>
        <FaAngleDown className={open ? styles.caretOpen : ""} aria-hidden="true" />
      </h2>
      <div className={styles.sectionBody} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
CollapsibleSection.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};
