import { useTranslation } from 'react-i18next';
import styles from './UserPage.module.css';
import { ChangeEvent } from 'react';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Header from '../../components/Header/Header';
import { CgBriefcase } from 'react-icons/cg';
import { useUserPage } from '../../hooks/useUserPage';
import { IUseUserPageReturnType } from '../types';

function UserPage() {
  const { t } = useTranslation();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    email,
    setEmail,
    code,
    setCode,
    showCode,
    showIsVerifiedEmail,
  } = useUserPage() as IUseUserPageReturnType;

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <Header
          label={t('my_personal_data')}
          hasButtonBack={false}
          icon={<CgBriefcase />}
        ></Header>
        <Label text={t('first_name')} isRequired isPadding isBold />
        <TextInput
          value={firstName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFirstName(event.target.value)
          }
        />
        <Label text={t('last_name')} isRequired isPadding isBold />
        <TextInput
          value={lastName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setLastName(event.target.value)
          }
        />
        <Label text={t('phone_number')} isPadding isBold />
        <TextInput
          disabled={true}
          value={phone} // Connect with the data obtained from tg
          placeholder={phone}
        />
        <Label text={t('email')} isRequired isPadding isBold />
        <TextInput
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
        {showIsVerifiedEmail ? (
          <div className={styles.isVerif}>
            {' '}
            <img
              className={styles.icons}
              src="https://cdn-icons-png.flaticon.com/512/9709/9709605.png"
              alt="chek"
            />
            <p className={styles.info_green}>{t('email_confirmed')}</p>
          </div>
        ) : (
          <div className={styles.isVerif}>
            <img
              className={styles.icons}
              src="https://static.vecteezy.com/system/resources/previews/018/887/460/original/signs-close-icon-png.png"
              alt="cross"
            />
            <p className={styles.info_red}>{t('email_not_confirmed')}</p>
          </div>
        )}
      </div>
      {showCode && (
        <div className={styles.code}>
          <Label text={t('code')} isPadding isBold />
          <input
            className={styles.code_valid}
            value={code}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setCode(event.target.value)
            }
          />
        </div>
      )}
    </div>
  );
}
export default UserPage;
