import { retrieveLaunchParams } from '@tma.js/sdk';
import { Address, OpenedContract, fromNano, toNano } from '@ton/core';
import { useCallback, useEffect, useState } from 'react';
import TonWeb from 'tonweb';
import { useModal } from '../context';
import { Course, NewCourse, NewPurchase } from '../ton/wrappers/Course';
import { Purchase } from '../ton/wrappers/Purchase';
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

export function useCourseContract(course: ICourse, role: RoleType) {
  const courseId = course.id;
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const { showModal } = useModal();
  const { initData } = retrieveLaunchParams();

  const [customerId, setCustomerId] = useState<any>(0);
  const [balance, setBalance] = useState<string>('0');
  const [balancePurchase, setBalancePurchase] = useState<string>('0');
  const [contractCourseAddress, setContractCourseAddress] = useState<any>('');
  const [contractPurchaseAddress, setContractPurchaseAddress] =
    useState<any>('');
  const [errorContract, setErrorContract] = useState<string>('');

  const { handleAddPointsForCreating, handlePurchaseCourse } = useCourseActions(
    course,
    role
  );

  useEffect(() => {
    setCustomerId(initData?.user?.id);
  }, [initData?.user?.id]);

  const coursePriceInNano = toNano(course.price.toString());

  const courseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = Address.parse(
      process.env.REACT_APP_COURSE_CONTRACT_ADDRESS || ''
    );

    const contract = await Course.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  // For this courseId and coursePrice
  const сourseContractWithNewData = useAsyncInitialize(async () => {
    if (!client) return;

    const contractByData = await Course.fromInit(
      courseId,
      coursePriceInNano,
      BigInt(course.userId)
    );
    const contractAddress = Address.parse(contractByData.address.toString());
    const contract = await Course.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  const getContractBalance = useCallback(async () => {
    try {
      const contractByData = await Course.fromInit(
        courseId,
        coursePriceInNano,
        BigInt(course.userId)
      );
      const contractAddress = contractByData.address.toString();
      setContractCourseAddress(contractAddress);
      const balanceInfo = await tonweb.provider.getBalance(contractAddress);
      return balanceInfo;
    } catch (error) {
      return '0';
    }
  }, [courseId, coursePriceInNano, course.userId]);

  const getContractPurchaseBalance = useCallback(async () => {
    try {
      const contractByData = await Purchase.fromInit(
        BigInt(customerId),
        contractCourseAddress.address
      );
      const contractAddress = contractByData.address.toString();
      setContractPurchaseAddress(contractAddress);
      const balanceInfo = await tonweb.provider.getBalance(contractAddress);
      return balanceInfo;
    } catch (error: any) {
      setErrorContract(error?.message);
      return '0';
    }
  }, [
    courseId,
    coursePriceInNano,
    course.userId,
    customerId,
    contractCourseAddress,
  ]);

  const updateBalance = useCallback(async () => {
    const contractBalance = await getContractBalance();
    setBalance(fromNano(contractBalance));
  }, [getContractBalance]);

  const updatePurchaseBalance = useCallback(async () => {
    const contractBalance = await getContractPurchaseBalance();
    setBalancePurchase(fromNano(contractBalance));
  }, [getContractPurchaseBalance]);

  const checkAndUpdateBalance = useCallback(async () => {
    const initialBalance = await getContractBalance();
    setBalance(fromNano(initialBalance));

    const intervalId = setInterval(async () => {
      const currentBalance = await getContractBalance();
      if (currentBalance !== initialBalance) {
        setBalance(fromNano(currentBalance));

        try {
          await handleAddPointsForCreating();
          showModal('create', course.name);
        } catch (error: any) {}

        clearInterval(intervalId);
      }
    }, 5000); // 5 sec

    // Clear the interval when unmounting a component or changing dependencies
    return () => clearInterval(intervalId);
  }, [getContractBalance, handleAddPointsForCreating, showModal, course.name]);

  const checkAndUpdatePurchaseBalance = useCallback(async () => {
    const initialBalance = await getContractPurchaseBalance();
    setBalancePurchase(fromNano(initialBalance));

    const intervalId = setInterval(async () => {
      const currentBalance = await getContractPurchaseBalance();
      if (currentBalance !== initialBalance) {
        setBalancePurchase(fromNano(currentBalance));

        try {
          await handlePurchaseCourse();
          showModal('purchase', course.name);
        } catch (error: any) {
          setErrorContract(error?.message);
        }

        clearInterval(intervalId);
      }
    }, 5000); // 5 sec

    // Clear the interval when unmounting a component or changing dependencies
    return () => clearInterval(intervalId);
  }, [
    getContractPurchaseBalance,
    handlePurchaseCourse,
    showModal,
    course.name,
  ]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    updatePurchaseBalance();
  }, [updatePurchaseBalance]);

  return {
    customerId,
    balance,
    balancePurchase,
    errorContract,
    contractCourseAddress,
    contractPurchaseAddress,
    createCourse: async () => {
      const message: NewCourse = {
        $$type: 'NewCourse',
        courseId,
        coursePrice: coursePriceInNano,
        sellerId: BigInt(course.userId),
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
      const message: NewPurchase = {
        $$type: 'NewPurchase',
        customerId: BigInt(customerId),
      };
      try {
        await сourseContractWithNewData?.send(
          sender,
          {
            value: coursePriceInNano + toNano('0.21'),
          },
          message
        );
        await checkAndUpdatePurchaseBalance();
      } catch (error: any) {
        setErrorContract(
          `Transaction failed or was rejected. ${error?.message}`
        );
      }
    },
  };
}
