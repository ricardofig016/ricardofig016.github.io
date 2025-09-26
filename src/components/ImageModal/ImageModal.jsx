import styles from "./ImageModal.module.css";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";

export default function ImageModal({ src, alt, className }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div onClick={handleOpen} role="button" className={className} tabIndex={0}>
      <img src={src} alt={alt} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          <img src={src} alt={alt} className={styles.modalImage} />
        </div>
      </Modal>
    </div>
  );
}
ImageModal.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};
