import { OpenedContract, address, fromNano, toNano } from '@ton/core';
import { useCallback, useEffect, useState } from 'react';
import TonWeb from 'tonweb';
import { Course, NewCourse } from '../ton/wrappers/Course';
import { useAsyncInitialize } from './useAsyncInitialize';
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

export function useContract(courseId: string, coursePrice: number) {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const [balance, setBalance] = useState<string>('0');
  const [errorContract, setErrorContract] = useState<string>('');

  const coursePriceInNano = toNano(coursePrice.toString());

  const courseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = address(
      process.env.REACT_APP_COURSE_CONTRACT_ADDRESS || ''
    );

    const contract = await Course.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  // For this courseId and coursePrice
  const сourseContractWithNewData = useAsyncInitialize(async () => {
    if (!client) return;

    const contractByData = await Course.fromInit(courseId, coursePriceInNano);
    const contractAddress = address(contractByData.address.toString());
    const contract = await Course.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  const getContractBalance = useCallback(async () => {
    try {
      const сourseContractByData = await Course.fromInit(
        courseId,
        coursePriceInNano
      );
      const courseContractAddress = сourseContractByData.address.toString();
      const balanceInfo = await tonweb.provider.getBalance(
        courseContractAddress
      );
      return balanceInfo;
    } catch (error) {
      return '0';
    }
  }, [courseId, coursePriceInNano]);

  const updateBalance = useCallback(async () => {
    const contractBalance = await getContractBalance();
    setBalance(fromNano(contractBalance));
  }, [getContractBalance]);

  const checkAndUpdateBalance = useCallback(async () => {
    const initialBalance = await getContractBalance();
    setBalance(fromNano(initialBalance));

    const intervalId = setInterval(async () => {
      const currentBalance = await getContractBalance();
      if (currentBalance !== initialBalance) {
        setBalance(fromNano(currentBalance));
        clearInterval(intervalId);
      }
    }, 5000); // 5 sec

    // Clear the interval when unmounting a component or changing dependencies
    return () => clearInterval(intervalId);
  }, [getContractBalance]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return {
    balance,
    errorContract,
    createCourse: async () => {
      const message: NewCourse = {
        $$type: 'NewCourse',
        courseId,
        coursePrice: coursePriceInNano,
      };
      try {
        await courseDefaultContract?.send(
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

    purchaseCourse: async () => {
      try {
        await сourseContractWithNewData?.send(
          sender,
          {
            value: coursePriceInNano + toNano('0.21'),
          },
          'New purchase'
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
