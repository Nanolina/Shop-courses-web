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

  const [balance, setBalance] = useState<string | null>(null);

  const coursePriceInNano = toNano(coursePrice.toString());

  const courseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = address(
      process.env.REACT_APP_COURSE_CONTRACT_ADDRESS || ''
    );

    const contract = await Course.fromAddress(contractAddress);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  // for this courseId and coursePrice
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
      return null;
    }
  }, [courseId, coursePriceInNano]);

  useEffect(() => {
    const fetchData = async () => {
      const contractBalance = await getContractBalance();
      setBalance(fromNano(contractBalance));
    };

    fetchData();
  }, [getContractBalance]);

  return {
    balance,
    createCourse: () => {
      const message: NewCourse = {
        $$type: 'NewCourse',
        courseId,
        coursePrice: coursePriceInNano,
      };
      courseDefaultContract?.send(
        sender,
        {
          value: toNano('0.07'),
        },
        message
      );
    },

    purchaseCourse: () => {
      сourseContractWithNewData?.send(
        sender,
        {
          value: coursePriceInNano + toNano('0.21'),
        },
        'New purchase'
      );
    },
  };
}
