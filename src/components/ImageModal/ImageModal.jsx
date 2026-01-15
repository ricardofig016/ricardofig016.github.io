import { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { FaXmark } from "react-icons/fa6";
import PropTypes from "prop-types";
import styles from "./ImageModal.module.css";

export default function ImageModal({ src, alt, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
    document.body.style.overflow = "hidden";
  };

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.style.overflow = "auto";
    }, 200); // Matches animation duration
  }, [isClosing]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen && !isClosing) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isClosing, handleClose]);

  const modalContent = (
    <div className={`${styles.overlay} ${isClosing ? styles.closing : ""}`} onClick={handleClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close modal">
          <FaXmark size={24} />
        </button>
        <img src={src} alt={alt} className={styles.modalImage} />
      </div>
    </div>
  );

  return (
    <>
      <div onClick={handleOpen} onKeyDown={(e) => e.key === "Enter" && handleOpen()} role="button" className={`${styles.thumbnail} ${className || ""}`} tabIndex={0}>
        <img src={src} alt={alt} />
      </div>
      {isOpen && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
}

ImageModal.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};
