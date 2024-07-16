import { useTranslation } from 'react-i18next';
import { IContractInfoModalContentProps } from '../types';
import styles from './ContractInfoModalContent.module.css';

const ContractInfoModalContent: React.FC<IContractInfoModalContentProps> = ({
  showModalFromSeller,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {showModalFromSeller ? (
        <div>
          <div className={styles.info}>
            <p className={styles.bold}>{t('contract_for_seller')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_1')}</p>
            <p>{t('contract_for_seller_1_1')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_2')}</p>
            <p>{t('contract_for_seller_2_1')}</p>
            <p>{t('contract_for_seller_2_2')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_3')}</p>
            <p>{t('contract_for_seller_3_1')}</p>
            <p className={styles.important}>{t('contract_for_seller_3_2')}</p>
            <p>{t('contract_for_seller_3_3')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_4')}</p>
            <p>{t('contract_for_seller_4_1')}</p>
            <p>{t('contract_for_seller_4_2')}</p>
            <p className={styles.important}>{t('contract_for_seller_4_3')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_5')}</p>
            <p>{t('contract_part_5_1')}</p>
            <p>{t('contract_for_seller_5_2')}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.info}>
            <p className={styles.bold}>{t('contract_for_customer')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_1')}</p>
            <p>{t('contract_for_customer_1_1')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_2')}</p>
            <p>{t('contract_for_customer_2_1')}</p>
            <p className={styles.important}>{t('contract_for_customer_2_2')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_3')}</p>
            <p>{t('contract_for_customer_3_1')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_4')}</p>
            <p>{t('contract_for_customer_4_1')}</p>
            <p className={styles.important}>{t('contract_for_customer_4_2')}</p>
          </div>
          <div className={styles.oneCategoryInfo}>
            <p className={styles.bold}>{t('contract_part_5')}</p>
            <p>{t('contract_part_5_1')}</p>
            <p>{t('contract_for_customer_5_2')}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContractInfoModalContent;
