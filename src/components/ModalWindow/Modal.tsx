import { useEffect, useState } from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, content, confirm }: any) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          className={styles.image}
          src="https://regmedia.co.uk/2022/08/04/shutterstock_delete_trash_button.jpg"
          alt="delete"
        />
        {content}
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
