import { useEffect } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import { IItemNotFoundPageProps } from '../types';
import styles from './ItemNotFoundPage.module.css';

const tg = window.Telegram.WebApp;

function ItemNotFoundPage({
  error = 'Item not found',
}: IItemNotFoundPageProps) {
  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  return (
    <Container>
      <Header />
      <div className={styles.container}>
        <img
          src="/page-not-found.png"
          alt="Page not found"
          className={styles.image}
        />
        <h2 className={styles.opsMessage}>
          <RiErrorWarningLine />
          Ooops, something went wrong
        </h2>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    </Container>
  );
}

export default ItemNotFoundPage;
