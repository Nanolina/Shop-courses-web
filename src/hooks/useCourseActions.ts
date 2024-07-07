import { CHAIN } from '@tonconnect/ui-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER } from '../consts';
import { useContract } from '../context';
import { getCSSVariableValue } from '../functions';
import { ICourse, RoleType } from '../types';
import { useTonConnect } from './useTonConnect';

const tg = window.Telegram.WebApp;
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

export function useCourseActions(course: ICourse, role: RoleType) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { connected, network } = useTonConnect();
  const { courseContractBalance } = useContract();

  const [isActivateButtonDisabled, setIsActivateButtonDisabled] =
    useState<boolean>(true);
  const [activateButtonHint, setActivateButtonHint] = useState<string>('');
  const [isMainnet, setIsMainnet] = useState<boolean>(false);

  const navigateToModulesPage = useCallback(
    () => navigate(`/module/course/${course.id}`),
    [course.id, navigate]
  );

  const getParamsMainButton = useCallback(() => {
    const buttonColor = getCSSVariableValue('--tg-theme-button-color');
    const isActive =
      (isProduction && isMainnet && connected && courseContractBalance > 0) ||
      (!isProduction && connected && courseContractBalance > 0);
    const color = isActive ? buttonColor : '#e6e9e9';

    return {
      is_active: isActive,
      color,
    };
  }, [isMainnet, connected, courseContractBalance]);

  const hintMessage = useMemo(() => {
    if (isProduction && !isMainnet) {
      return t('connect_wallet_mainnet');
    }
    if (!connected) {
      return t('connect_wallet');
    }
    if (courseContractBalance <= 0) {
      return t('course_not_activated');
    }
    return '';
  }, [isMainnet, connected, courseContractBalance, t]);

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
    isActivateButtonDisabled,
    activateButtonHint,
    isMainnet,
    navigateToModulesPage,
    getParamsMainButton,
    hintMessage,
  };
}
