import { Address, OpenedContract, fromNano, toNano } from '@ton/core';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useCallback, useEffect, useState } from 'react';
import TonWeb from 'tonweb';
import { useModal } from '../context';
import { Course, NewCourse } from '../ton/wrappers/Course';
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
  const eventBuilder = useTWAEvent();
  const courseId = course.id;
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const { showModal } = useModal();

  const [balance, setBalance] = useState<string>('0');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [errorContract, setErrorContract] = useState<string>('');

  const { handleAddPointsForCreating } = useCourseActions(course, role);

  const coursePriceInNano = toNano(course.price.toString());

  // Deployed course contract
  const courseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = Address.parse(
      process.env.REACT_APP_COURSE_CONTRACT_ADDRESS || ''
    );

    const contract = await Course.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  // Course contract with new data
  const getContractBalance = useCallback(async () => {
    try {
      const contractByData = await Course.fromInit(
        courseId,
        coursePriceInNano,
        BigInt(course.userId)
      );
      const contractAddress = contractByData.address.toString();
      setContractAddress(contractAddress);
      const balanceInfo = await tonweb.provider.getBalance(contractAddress);
      return balanceInfo;
    } catch (error) {
      return '0';
    }
  }, [courseId, coursePriceInNano, course.userId]);

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

        try {
          await handleAddPointsForCreating();
          showModal('create', course.name);
          eventBuilder.track('Contract Course created in TON', {});
        } catch (error: any) {
          setErrorContract(error?.message);
        }

        clearInterval(intervalId);
      }
    }, 5000); // 5 sec

    // Clear the interval when unmounting a component or changing dependencies
    return () => clearInterval(intervalId);
  }, [getContractBalance, handleAddPointsForCreating, showModal, course.name]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return {
    balance: parseFloat(balance),
    errorContract,
    contractAddress,
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
  };
}
