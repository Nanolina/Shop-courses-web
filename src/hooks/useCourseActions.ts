import { retrieveLaunchParams } from '@tma.js/sdk';
import { CHAIN } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CUSTOMER, SELLER, USER } from '../consts';
import { usePoints } from '../context';
import {
  createAxiosWithAuth,
  getCSSVariableValue,
  handleAuthError,
} from '../functions';
import { DeployType, ICourse, RoleType } from '../types';
import { useTonConnect } from './useTonConnect';

const tg = window.Telegram.WebApp;
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

export function useCourseActions(course: ICourse, role: RoleType) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { wallet, connected, network } = useTonConnect();
  const { refreshPoints } = usePoints();
  const { initDataRaw } = retrieveLaunchParams();

  const [isActivateButtonDisabled, setIsActivateButtonDisabled] =
    useState<boolean>(true);
  const [activateButtonHint, setActivateButtonHint] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deployType, setDeployType] = useState<DeployType | null>(null);
  const [isMainnet, setIsMainnet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigateToModulesPage = useCallback(
    () => navigate(`/module/course/${course.id}`),
    [course.id, navigate]
  );

  const handleUpdatePoints = useCallback(async () => {
    try {
      await refreshPoints();
      setDeployType('create');
      setModalOpen(true);
    } catch (error: any) {
      setError(error?.message);
    }
  }, [refreshPoints]);

  const handleAddPointsForCreating = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>(
        `/course/${course?.id}/points/add/creation`
      );
      if (response.status === 200) {
        await handleUpdatePoints();
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [course?.id, initDataRaw, handleUpdatePoints]);

  const handlePurchaseCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>(
        `/course/${course?.id}/purchase`
      );
      if (response.status === 201) {
        navigate('/course/purchased');
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [course?.id, initDataRaw, navigate]);

  useEffect(() => {
    if (role === USER && !connected) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [connected, role]);

  useEffect(() => {
    if (role === USER) {
      const buttonColor = getCSSVariableValue('--tg-theme-button-color');
      tg.MainButton.setParams({
        text: `${t('buy')} ${course.price} ${course.currency}`,
        is_active: !!wallet,
        color: !!wallet ? buttonColor : '#e6e9e9',
      });
      tg.onEvent('mainButtonClicked', handlePurchaseCourse);
      return () => tg.offEvent('mainButtonClicked', handlePurchaseCourse);
    } else if (role === SELLER || role === CUSTOMER) {
      tg.MainButton.setParams({
        text: t('modules'),
      });
      tg.onEvent('mainButtonClicked', navigateToModulesPage);
      return () => tg.offEvent('mainButtonClicked', navigateToModulesPage);
    }
  }, [course, navigateToModulesPage, handlePurchaseCourse, role, wallet, t]);

  // Сheck which network the wallet is from
  useEffect(() => {
    setIsMainnet(network === CHAIN.MAINNET);
  }, [network]);

  // Handle activate button
  useEffect(() => {
    let hint = '';
    let disabled = true;

    if (!connected) {
      hint = 'Please connect the wallet';
    } else if (isProduction && !isMainnet) {
      hint = 'Please connect the wallet from the main network';
    } else {
      disabled = false;
    }

    setActivateButtonHint(hint);
    setIsActivateButtonDisabled(disabled);
  }, [connected, isMainnet]);

  return {
    modalOpen,
    setModalOpen,
    deployType,
    isLoading,
    error,
    isActivateButtonDisabled,
    activateButtonHint,
    handleAddPointsForCreating,
  };
}
