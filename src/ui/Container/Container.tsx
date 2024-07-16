import { useEffect, useState } from 'react';
import { IContainerProps } from '../types';
import styles from './Container.module.css';

function Container({ children }: IContainerProps) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleFocus = () => setIsKeyboardOpen(true);
    const handleBlur = () => setIsKeyboardOpen(false);

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  const containerStyle = isKeyboardOpen
    ? `${styles.container} ${styles.isKeyboardButton}`
    : styles.container;

  return <div className={containerStyle}>{children}</div>;
}

export default Container;
