import { retrieveLaunchParams } from '@tma.js/sdk';
import { CHAIN } from '@tonconnect/ui-react';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER } from '../consts';
import { usePoints } from '../context';
import { createAxiosWithAuth, handleAuthError } from '../functions';
import { ICourse, RoleType } from '../types';
import { useTonConnect } from './useTonConnect';

const tg = window.Telegram.WebApp;
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

export function useCourseActions(course: ICourse, role: RoleType) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const eventBuilder = useTWAEvent();

  const { connected, network } = useTonConnect();
  const { refreshPoints } = usePoints();
  const { initDataRaw } = retrieveLaunchParams();

  const [isActivateButtonDisabled, setIsActivateButtonDisabled] =
    useState<boolean>(true);
  const [activateButtonHint, setActivateButtonHint] = useState<string>('');
  const [isMainnet, setIsMainnet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigateToModulesPage = useCallback(
    () => navigate(`/module/course/${course.id}`),
    [course.id, navigate]
  );

  const handleAddPointsForCreating = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>(
        `/course/${course?.id}/points/add/creation`
      );
      if (response.status === 200) {
        await refreshPoints();
        eventBuilder.track('Contract Course created in TON', {});
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [course?.id, initDataRaw, refreshPoints, eventBuilder]);

  const handlePurchaseCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>(
        `/course/${course?.id}/purchase`
      );
      if (response.status === 200) {
        await refreshPoints();
        navigate('/course/purchased');
        eventBuilder.track('Contract Purchase created in TON', {});
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [course?.id, initDataRaw, navigate, refreshPoints, eventBuilder]);

  useEffect(() => {
    if (role === USER && !connected) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [connected, role]);

  // Сheck which network the wallet is from
  useEffect(() => {
    setIsMainnet(network === CHAIN.MAINNET);
  }, [network]);

  // Handle activate button
  useEffect(() => {
    let hint = '';
    let disabled = true;

    if (!connected) {
      hint = t('connect_wallet');
    } else if (isProduction && !isMainnet) {
      hint = t('connect_wallet_mainnet');
    } else {
      disabled = false;
    }

    setActivateButtonHint(hint);
    setIsActivateButtonDisabled(disabled);
  }, [connected, isMainnet, t]);

  return {
    isLoading,
    error,
    isActivateButtonDisabled,
    activateButtonHint,
    isMainnet,
    handleAddPointsForCreating,
    handlePurchaseCourse,
    navigateToModulesPage,
  };
}
