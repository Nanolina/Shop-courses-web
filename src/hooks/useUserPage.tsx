import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { retrieveLaunchParams } from '@tma.js/sdk';
import {
  createAxiosWithAuth,
  getCSSVariableValue,
  handleAuthError,
} from '../functions';

const tg = window.Telegram.WebApp;

export function useUserPage() {
  const { t } = useTranslation();

  const { initDataRaw } = retrieveLaunchParams();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailFromDB, setEmailFromDB] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isVerifiedEmail, setIsVerifiedEmail] = useState<boolean>(true);
  const [showIsVerifiedEmail, setShowIsVerifiedEmail] =
    useState<boolean>(false);
  const [buttonResendCode, setButtonResendCode] = useState<boolean>(true);

  const navigate = useNavigate();

  const getDataUser = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get('/user');
      if (response.status === 200) {
        const {
          firstName: firstNameFromDB,
          lastName: lastNameFromDB,
          phone: phoneFromDB,
          email: emailFromDB,
          isVerifiedEmail,
        } = response.data;
        setFirstName(firstNameFromDB);
        setLastName(lastNameFromDB);
        setPhone(phoneFromDB);
        setEmail(emailFromDB);
        setShowIsVerifiedEmail(isVerifiedEmail);
        setEmailFromDB(emailFromDB);
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [initDataRaw]);

  const saveDataAndGenerateCode = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.patch(`/user`, {
        firstName,
        lastName,
        email,
      });
      setIsVerifiedEmail(response.data.isVerifiedEmail);
      if (response.status === 200 && !isVerifiedEmail) {
        setShowIsVerifiedEmail(isVerifiedEmail);
        setShowCode(true);
      } else if (response.status === 200 && isVerifiedEmail) {
        setShowIsVerifiedEmail(!isVerifiedEmail);
        tg.MainButton.hide();
        navigate('/');
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [
    initDataRaw,
    firstName,
    lastName,
    email,
    isVerifiedEmail,
    setIsVerifiedEmail,
    navigate,
  ]);

  const sendCodeFromUser = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post(`/user/email/code/${code}`);
      if (response.status === 200) {
        navigate('/course/create');
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [initDataRaw, code, navigate]);

  const resendCode = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post(`/user/email/code/resend`);
      if (response.status === 200) {
        setButtonResendCode(false);
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [initDataRaw, setButtonResendCode]);

  useEffect(() => {
    if (!firstName || !lastName || !email) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [firstName, lastName, email]);

  useEffect(() => {
    if (!showCode && email !== emailFromDB) {
      tg.MainButton.setParams({
        text: t('get_code'),
        color: getCSSVariableValue('--tg-theme-button-color'),
      });
      tg.onEvent('mainButtonClicked', saveDataAndGenerateCode);
      return () => tg.offEvent('mainButtonClicked', saveDataAndGenerateCode);
    } else if (showCode) {
      tg.MainButton.setParams({
        text: t('send'),
        color: getCSSVariableValue('--tg-theme-button-color'),
      });
      tg.onEvent('mainButtonClicked', sendCodeFromUser);
      return () => tg.offEvent('mainButtonClicked', sendCodeFromUser);
    } else if (!showCode) {
      tg.MainButton.setParams({
        text: t('save'),
        color: getCSSVariableValue('--tg-theme-button-color'),
      });
      tg.onEvent('mainButtonClicked', saveDataAndGenerateCode);
      return () => tg.offEvent('mainButtonClicked', saveDataAndGenerateCode);
    }
  }, [
    code,
    t,
    saveDataAndGenerateCode,
    sendCodeFromUser,
    showCode,
    showIsVerifiedEmail,
    emailFromDB,
    email,
    isVerifiedEmail,
  ]);

  useEffect(() => {
    getDataUser();
  }, [getDataUser]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    code,
    setCode,
    isLoading,
    setIsLoading,
    error,
    setError,
    showCode,
    showIsVerifiedEmail,
    setShowIsVerifiedEmail,
    buttonResendCode,
    setButtonResendCode,
    resendCode,
  };
}
