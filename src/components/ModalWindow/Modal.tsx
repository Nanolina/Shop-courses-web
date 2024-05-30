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
          src="https://static.javatpoint.com/computer/images/what-is-delete.png"
          alt="delete"
        ></img>
        {content}
        <div className={styles.containerBtn}>
          <button onClick={onClose} className={styles.btn}>
            Закрыть
          </button>
          <button onClick={confirm} className={styles.btn}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
