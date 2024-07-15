import { retrieveLaunchParams } from '@tma.js/sdk';
import { Address, OpenedContract, fromNano, toNano } from '@ton/core';
import { useCallback, useEffect, useState } from 'react';
import { useContract } from '../context';
import { createAxiosWithAuth, tonweb } from '../functions';
import { NewPurchase, Purchase } from '../ton/wrappers/Purchase';
import { DeployEnum, ICourse } from '../types';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function usePurchaseContract(course: ICourse) {
  const courseId = course.id;
  const { client } = useTonClient();
  const { sender } = useTonConnect(course);
  const { initDataRaw, initData } = retrieveLaunchParams();
  const { purchaseContractBalance, setPurchaseContractBalance } = useContract();

  const [customerId, setCustomerId] = useState<any>(0);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [errorContract, setErrorContract] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAcceptedTermsPurchase, setHasAcceptedTermsPurchase] =
    useState<boolean>(false);

  const coursePriceInNano = toNano(course.price.toString());

  // Deployed purchase contract
  const purchaseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const address: any = Address.parse(
      process.env.REACT_APP_PURCHASE_CONTRACT_ADDRESS || ''
    );

    const contract = await Purchase.fromAddress(address);
    return client.open(contract) as OpenedContract<Purchase>;
  }, [client]);

  // Purchase contract with new data
  const getContractData = useCallback(async () => {
    try {
      const contractByData = await Purchase.fromInit(
        courseId,
        coursePriceInNano,
        BigInt(course.userId),
        BigInt(initData?.user?.id || '')
      );
      const address = contractByData.address.toString();
      const balanceInNano = await tonweb.provider.getBalance(address);
      const balance = parseFloat(fromNano(balanceInNano));

      return {
        balance,
        address,
      };
    } catch (error: any) {
      return {
        balance: 0,
        address: '',
      };
    }
    // eslint-disable-next-line
  }, [courseId, coursePriceInNano, course.userId]);

  const updateContractData = useCallback(async () => {
    setLoading(true);
    const { balance, address } = await getContractData();
    setContractAddress(address);
    setPurchaseContractBalance(balance);
    setLoading(false);
  }, [getContractData, setPurchaseContractBalance]);

  useEffect(() => {
    setCustomerId(initData?.user?.id);
  }, [initData?.user?.id]);

  // Send data to backend to monitor contract status
  const monitorContract = useCallback(async () => {
    if (!initDataRaw) return;
    try {
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      if (contractAddress) {
        await axiosWithAuth.post<any>('/ton/monitor', {
          contractAddress,
          courseId,
          initialBalance: purchaseContractBalance,
          type: DeployEnum.Purchase,
          language: initData?.user?.languageCode,
          hasAcceptedTerms: hasAcceptedTermsPurchase,
        });
      }
    } catch (error: any) {
      return error?.message;
    }
  }, [
    initDataRaw,
    courseId,
    initData?.user?.languageCode,
    purchaseContractBalance,
    contractAddress,
    hasAcceptedTermsPurchase,
  ]);

  useEffect(() => {
    updateContractData();
  }, [updateContractData]);

  return {
    customerId,
    errorContract,
    contractAddress,
    loading,
    hasAcceptedTermsPurchase,
    setHasAcceptedTermsPurchase,

    // Send money to 2 contracts: seller contract with type Sale (useTonConnect) and create purchase contract "NewPurchase"
    purchaseCourse: async () => {
      const message: NewPurchase = {
        courseId,
        $$type: 'NewPurchase',
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
        await monitorContract();
      } catch (error: any) {
        setErrorContract(
          `Transaction failed or was rejected. ${error?.message}`
        );
      }
    },
  };
}
