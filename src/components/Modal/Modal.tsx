import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
              {t('cancel')}
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
