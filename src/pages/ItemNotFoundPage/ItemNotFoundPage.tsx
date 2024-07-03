import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RiErrorWarningLine } from 'react-icons/ri';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import { IItemNotFoundPageProps } from '../types';
import styles from './ItemNotFoundPage.module.css';

const tg = window.Telegram.WebApp;

function ItemNotFoundPage({
  error,
  isLoading = false,
  hasButtonBackHeader = true,
}: IItemNotFoundPageProps) {
  const { t } = useTranslation();

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) {
    return;
  }

  return (
    <Container>
      <Header hasButtonBack={hasButtonBackHeader} />
      <div className={styles.container}>
        <img
          src="/page-not-found.png"
          alt="Page not found"
          className={styles.image}
        />
        <h2 className={styles.opsMessage}>
          <RiErrorWarningLine />
          {t('something_wrong')}
        </h2>
        <div className={styles.errorMessage}>
          {error || t('item_not_found')}
        </div>
      </div>
    </Container>
  );
}

export default ItemNotFoundPage;
