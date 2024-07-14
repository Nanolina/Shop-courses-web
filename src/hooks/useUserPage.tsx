import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCSSVariableValue, handleAuthError } from '../functions';
import {
  IFetchUserDetails,
  IUserDataToUpdate,
  fetchUserDetailsAPI,
  resendCodeAPI,
  saveDataAndGenerateCodeAPI,
  sendCodeFromUserAPI,
} from '../requests';

const tg = window.Telegram.WebApp;

export function useUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { initDataRaw } = retrieveLaunchParams();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailFromDB, setEmailFromDB] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [showIsVerifiedEmail, setShowIsVerifiedEmail] =
    useState<boolean>(false);
  const [buttonResendCode, setButtonResendCode] = useState<boolean>(true);
  const [errorPage, setErrorPage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Get data from server
  const { data, error, isLoading, isSuccess } = useQuery<IFetchUserDetails>({
    queryKey: ['userDetails', initDataRaw],
    queryFn: () => fetchUserDetailsAPI(initDataRaw),
    enabled: !!initDataRaw,
    placeholderData: () => {
      return queryClient.getQueryData(['userDetails', initDataRaw]);
    },
  });

  // Send data to server
  const dataToSend: IUserDataToUpdate = {
    firstName,
    lastName,
    email,
  };

  // Mutations
  const saveDataAndGenerateCodeMutation = useMutation({
    mutationFn: () => saveDataAndGenerateCodeAPI(initDataRaw, dataToSend),
    onSuccess: (data) => {
      const isVerifiedEmail = data.isVerifiedEmail;
      if (isVerifiedEmail) {
        setShowIsVerifiedEmail(isVerifiedEmail);
        tg.MainButton.hide();
        navigate('/');
      } else {
        setShowIsVerifiedEmail(!isVerifiedEmail);
        setShowCode(true);
      }
      queryClient.invalidateQueries({
        queryKey: ['userDetails', initDataRaw],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setErrorPage);
    },
  });

  const sendCodeFromUserMutation = useMutation({
    mutationFn: () => sendCodeFromUserAPI(initDataRaw, code),
    onSuccess: () => {
      navigate('/course/create');
      queryClient.invalidateQueries({
        queryKey: ['userDetails', initDataRaw],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setErrorPage);
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: () => resendCodeAPI(initDataRaw),
    onSuccess: () => {
      setButtonResendCode(false);
    },
    onError: (error: any) => {
      handleAuthError(error, setErrorPage);
    },
  });

  // Callbacks
  const saveDataAndGenerateCode = useCallback(
    () => saveDataAndGenerateCodeMutation.mutate(),
    [saveDataAndGenerateCodeMutation]
  );

  const sendCodeFromUser = useCallback(
    () => sendCodeFromUserMutation.mutate(),
    [sendCodeFromUserMutation]
  );

  const resendCode = useCallback(
    () => resendCodeMutation.mutate(),
    [resendCodeMutation]
  );

  // useEffects
  useEffect(() => {
    if (isSuccess) {
      const {
        firstName: firstNameFromDB,
        lastName: lastNameFromDB,
        phone: phoneFromDB,
        email: emailFromDB,
        isVerifiedEmail,
      } = data;
      setFirstName(firstNameFromDB);
      setLastName(lastNameFromDB);
      setPhone(phoneFromDB);
      setEmail(emailFromDB);
      setShowIsVerifiedEmail(isVerifiedEmail);
      setEmailFromDB(emailFromDB);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (!firstName || !email) {
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
  ]);

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
    showCode,
    showIsVerifiedEmail,
    setShowIsVerifiedEmail,
    buttonResendCode,
    setButtonResendCode,
    resendCode,

    isLoading:
      isLoading ||
      saveDataAndGenerateCodeMutation.isPending ||
      sendCodeFromUserMutation.isPending ||
      resendCodeMutation.isPending,
    error: error?.message || errorPage,
  };
}
