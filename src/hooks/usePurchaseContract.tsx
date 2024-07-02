import { retrieveLaunchParams } from '@tma.js/sdk';
import { Address, OpenedContract, fromNano, toNano } from '@ton/core';
import { useCallback, useEffect, useState } from 'react';
import TonWeb from 'tonweb';
import { useModal } from '../context';
import { NewPurchase, Purchase } from '../ton/wrappers/Purchase';
import { ICourse, RoleType } from '../types';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useCourseActions } from './useCourseActions';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';
const tonweb = new TonWeb(
  new TonWeb.HttpProvider(
    isProduction
      ? 'https://toncenter.com/api/v2/jsonRPC'
      : 'https://testnet.toncenter.com/api/v2/jsonRPC'
  )
);

export function usePurchaseContract(course: ICourse, role: RoleType) {
  const courseId = course.id;
  const { client } = useTonClient();
  const { sender } = useTonConnect(course);
  const { showModal } = useModal();
  const { initData } = retrieveLaunchParams();

  const [customerId, setCustomerId] = useState<any>(0);
  const [balance, setBalance] = useState<string>('0');
  const [purchaseContractAddress, setPurchaseContractAddress] =
    useState<string>('');
  const [errorContract, setErrorContract] = useState<string>('');

  const { handlePurchaseCourse } = useCourseActions(course, role);

  const coursePriceInNano = toNano(course.price.toString());

  // Deployed purchase contract
  const purchaseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = Address.parse(
      process.env.REACT_APP_PURCHASE_CONTRACT_ADDRESS || ''
    );

    const contract = await Purchase.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Purchase>;
  }, [client]);

  // Purchase contract with new data
  const getPurchaseContractBalance = useCallback(async () => {
    try {
      const contractByData = await Purchase.fromInit(
        courseId,
        coursePriceInNano,
        BigInt(course.userId),
        BigInt(customerId)
      );
      const contractAddress = contractByData.address.toString();
      setPurchaseContractAddress(contractAddress);
      const balanceInfo = await tonweb.provider.getBalance(contractAddress);
      return balanceInfo;
    } catch (error) {
      return '0';
    }
  }, [courseId, coursePriceInNano, course.userId, customerId]);

  const updateBalance = useCallback(async () => {
    const contractBalance = await getPurchaseContractBalance();
    setBalance(fromNano(contractBalance));
  }, [getPurchaseContractBalance]);

  const checkAndUpdateBalance = useCallback(async () => {
    const initialBalance = await getPurchaseContractBalance();
    setBalance(fromNano(initialBalance));

    const intervalId = setInterval(async () => {
      const currentBalance = await getPurchaseContractBalance();
      if (currentBalance !== initialBalance) {
        setBalance(fromNano(currentBalance));

        try {
          await handlePurchaseCourse();
          showModal('purchase', course.name);
        } catch (error: any) {}

        clearInterval(intervalId);
      }
    }, 5000); // 5 sec

    // Clear the interval when unmounting a component or changing dependencies
    return () => clearInterval(intervalId);
  }, [
    getPurchaseContractBalance,
    handlePurchaseCourse,
    showModal,
    course.name,
  ]);

  useEffect(() => {
    setCustomerId(initData?.user?.id);
  }, [initData?.user?.id]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return {
    customerId,
    balance,
    errorContract,
    purchaseContractAddress,

    // Send money to 2 contracts: seller contract "Sale" (useTonConnect) and create purchase contract "NewPurchase"
    purchaseCourse: async () => {
      const message: NewPurchase = {
        $$type: 'NewPurchase',
        courseId,
        coursePrice: coursePriceInNano,
        sellerId: BigInt(course.userId),
        customerId: BigInt(customerId),
      };
      try {
        await purchaseDefaultContract?.send(
          sender,
          {
            value: toNano('0.07'),
          },
          message
        );
        await checkAndUpdateBalance();
      } catch (error: any) {
        setErrorContract(
          `Transaction failed or was rejected. ${error?.message}`
        );
      }
    },
  };
}
