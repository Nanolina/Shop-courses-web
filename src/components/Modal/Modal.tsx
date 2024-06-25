import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { IModalProps } from '../types';
import styles from './Modal.module.css';

function Modal({
  isOpen,
  onClose,
  confirm,
  buttonRightText,
  children,
}: IModalProps) {
  const [show, setShow] = useState<boolean>(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <RxCross2
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={20}
          onClick={onClose}
        />
        {children}
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
