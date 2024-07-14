import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgBriefcase } from 'react-icons/cg';
import { MdOutlineUpdate } from 'react-icons/md';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Header from '../../components/Header/Header';
import { useUserPage } from '../../hooks/useUserPage';
import Button from '../../ui/Button/Button';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import { IUseUserPageReturnType } from '../types';
import styles from './UserPage.module.css';

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
    isLoading,
    error,
    code,
    setCode,
    showCode,
    showIsVerifiedEmail,
    buttonResendCode,
    setButtonResendCode,
    resendCode,
  } = useUserPage() as IUseUserPageReturnType;

  let [counter, setCounter] = useState<number>(120);

  const showCouner = useCallback(() => {
    const idInterval = setInterval(() => {
      setCounter(counter--);
      if (counter === 0) {
        setButtonResendCode(true);
        setCounter(120);
        clearInterval(idInterval);
      }
    }, 1000);
  }, [counter, setCounter, setButtonResendCode]);

  return (
    <Container>
      <div className={styles.formGroup}>
        <Header
          label={t('my_personal_data')}
          hasButtonBack={false}
          icon={<CgBriefcase size={24} />}
        />
        <Label text={t('first_name')} isRequired isPadding isBold />
        <TextInput
          value={firstName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFirstName(event.target.value)
          }
        />
        <Label text={t('last_name')} isPadding isBold />
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
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
      </div>
      {showCode ? (
        <>
          <div className={styles.code}>
            <Label text={t('code')} isPadding isBold />
            <input
              className={styles.codeValid}
              value={code}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setCode(event.target.value)
              }
            />
          </div>
          <div>
            <Button
              text={t('resend_code')}
              onClick={() => {
                resendCode();
                showCouner();
              }}
              disabled={!buttonResendCode}
            />
            <div className={styles.counter}>
              <MdOutlineUpdate />
              <p>
                {t('request_code')}
                {counter}
              </p>
            </div>
          </div>
        </>
      ) : showIsVerifiedEmail ? (
        <div className={styles.isVerifiedEmail}>
          <LazyLoadImage
            src="https://cdn-icons-png.flaticon.com/512/9709/9709605.png"
            alt="chek"
            effect="blur"
            className={styles.icons}
          />
          <p className={styles.infoGreen}>{t('email_confirmed')}</p>
        </div>
      ) : (
        <div className={styles.isVerif}>
          <LazyLoadImage
            src="https://static.vecteezy.com/system/resources/previews/018/887/460/original/signs-close-icon-png.png"
            alt="cross"
            effect="blur"
            className={styles.icons}
          />
          <p className={styles.infoRed}>{t('email_not_confirmed')}</p>
        </div>
      )}

      {isLoading && <Loader />}
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}
export default UserPage;
