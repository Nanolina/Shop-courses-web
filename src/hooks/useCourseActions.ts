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
  const {
    courseContractBalance,
    purchaseContractBalance,
    hasAcceptedTermsCourse,
    hasAcceptedTermsPurchase,
  } = useContract();

  const [isActivateButtonDisabled, setIsActivateButtonDisabled] =
    useState<boolean>(true);
  const [activateButtonHint, setActivateButtonHint] = useState<string>('');
  const [isMainnet, setIsMainnet] = useState<boolean>(false);

  const navigateToModulesPage = useCallback(
    () => navigate(`/module/course/${course.id}`),
    [course.id, navigate]
  );

  // For Customer
  const getParamsMainButton = useCallback(() => {
    const buttonColor = getCSSVariableValue('--tg-theme-button-color');
    const productionIsActiveButton =
      isProduction &&
      isMainnet &&
      connected &&
      courseContractBalance > 0 &&
      hasAcceptedTermsPurchase;
    const developmentIsActiveButton =
      !isProduction &&
      connected &&
      courseContractBalance > 0 &&
      hasAcceptedTermsPurchase;
    const isActive = productionIsActiveButton || developmentIsActiveButton;
    const color = isActive ? buttonColor : '#e6e9e9';

    return {
      is_active: isActive,
      color,
    };
  }, [isMainnet, connected, courseContractBalance, hasAcceptedTermsPurchase]);

  // For сustomer
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
    if (!hasAcceptedTermsPurchase && purchaseContractBalance <= 0) {
      return t('accepted');
    }
    return '';
  }, [
    isMainnet,
    connected,
    courseContractBalance,
    purchaseContractBalance,
    hasAcceptedTermsPurchase,
    t,
  ]);

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

  // Handle activate button (for seller)
  useEffect(() => {
    let hint = '';
    let disabled = true;

    if (!connected) {
      hint = t('connect_wallet');
    } else if (isProduction && !isMainnet) {
      hint = t('connect_wallet_mainnet');
    } else if (!hasAcceptedTermsCourse) {
      hint = t('accepted');
    } else {
      disabled = false;
    }

    setActivateButtonHint(hint);
    setIsActivateButtonDisabled(disabled);
  }, [connected, isMainnet, hasAcceptedTermsCourse, t]);

  return {
    isActivateButtonDisabled,
    activateButtonHint,
    isMainnet,
    navigateToModulesPage,
    getParamsMainButton,
    hintMessage,
  };
}
