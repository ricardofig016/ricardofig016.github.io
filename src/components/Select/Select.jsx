import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";
import { FaAngleDown } from "react-icons/fa";
import PropTypes from "prop-types";

export default function Select({ options = [], value, onChange, placeholder = "Select...", id }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) setHighlight(-1);
  }, [open]);

  // Click outside closes
  useEffect(() => {
    function handleDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // Keyboard handling
  function onControlKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h === -1 ? 0 : h + 1, options.length - 1));
      setTimeout(() => focusHighlighted(), 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max(h === -1 ? options.length - 1 : h - 1, 0));
      setTimeout(() => focusHighlighted(), 0);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
      if (!open && highlight >= 0) {
        selectByIndex(highlight);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function focusHighlighted() {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll("[role='option']");
    if (items[highlight]) items[highlight].scrollIntoView({ block: "nearest" });
  }

  function selectByIndex(i) {
    const opt = options[i];
    if (!opt) return;
    onChange?.(opt.value);
    setOpen(false);
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id ? `${id}-label` : undefined}
        className={styles.control}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onControlKeyDown}
      >
        <span className={styles.value}>
          {selectedOption ? selectedOption.label : <span className={styles.placeholder}>{placeholder}</span>}
        </span>
        <FaAngleDown className={styles.arrow} aria-hidden="true" />
      </button>

      {open && (
        <ul
          className={styles.list}
          role="listbox"
          aria-activedescendant={highlight >= 0 ? `opt-${highlight}` : undefined}
          tabIndex={-1}
          ref={listRef}
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isHighlighted = i === highlight;
            return (
              <li
                key={opt.value ?? i}
                id={`opt-${i}`}
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${isHighlighted ? styles.highlighted : ""} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlight(i)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string,
};
