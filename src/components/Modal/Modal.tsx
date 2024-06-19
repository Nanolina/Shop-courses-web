import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { ModalProps } from '../types';
import styles from './Modal.module.css';

function Modal({
  title,
  isOpen,
  onClose,
  content,
  imageUrl,
  confirm,
  buttonRightText,
}: ModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {title}
        {imageUrl && (
          <img className={styles.image} src={imageUrl} alt="modal" />
        )}
        {!confirm && (
          <RxCross2
            className={styles.cross}
            color="var(--tg-theme-accent-text-color)"
            size={20}
            onClick={onClose}
          />
        )}
        {content}
        {confirm && (
          <div className={styles.containerBtn}>
            <button onClick={onClose} className={styles.btnCancel}>
              Cancel
            </button>
            <button
              onClick={() => {
                confirm();
                onClose();
              }}
              className={styles.btnContinue}
            >
              {buttonRightText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
