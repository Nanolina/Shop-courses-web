import { retrieveLaunchParams } from '@tma.js/sdk';
import { Address, OpenedContract, fromNano, toNano } from '@ton/core';
import { useCallback, useEffect, useState } from 'react';
import TonWeb from 'tonweb';
import { useContract } from '../context';
import { createAxiosWithAuth } from '../functions';
import { Course, NewCourse } from '../ton/wrappers/Course';
import { DeployEnum, ICourse, RoleType } from '../types';
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

export function useCourseContract(course: ICourse, role: RoleType) {
  const courseId = course.id;
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const { initDataRaw, initData } = retrieveLaunchParams();
  const { courseContractBalance, setCourseContractBalance } = useContract();

  const [contractAddress, setContractAddress] = useState<string>('');
  const [errorContract, setErrorContract] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const coursePriceInNano = toNano(course.price.toString());

  // Deployed course contract
  const courseDefaultContract = useAsyncInitialize(async () => {
    if (!client) return;
    const address: any = Address.parse(
      process.env.REACT_APP_COURSE_CONTRACT_ADDRESS || ''
    );

    const contract = await Course.fromAddress(address);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

  // Course contract with new data
  const getContractData = useCallback(async () => {
    try {
      const contractByData = await Course.fromInit(
        courseId,
        coursePriceInNano,
        BigInt(course.userId)
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
  }, [courseId, coursePriceInNano, course.userId]);

  // Get contract address and balance
  const updateContractData = useCallback(async () => {
    setLoading(true);
    const { balance, address } = await getContractData();
    setContractAddress(address);
    setCourseContractBalance(balance);
    setLoading(false);
  }, [getContractData, setCourseContractBalance]);

  // Send data to backend to monitor contract status
  const monitorContract = useCallback(async () => {
    if (!initDataRaw) return;
    try {
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      if (contractAddress) {
        await axiosWithAuth.post('/ton/monitor', {
          contractAddress,
          courseId,
          initialBalance: courseContractBalance,
          type: DeployEnum.Create,
          language: initData?.user?.languageCode,
        });
      }
    } catch (error: any) {
      return error?.message;
    }
  }, [
    initDataRaw,
    courseId,
    initData?.user?.languageCode,
    courseContractBalance,
    contractAddress,
  ]);

  useEffect(() => {
    updateContractData();
  }, [updateContractData]);

  return {
    errorContract,
    contractAddress,
    loading,
    createCourse: async () => {
      const message: NewCourse = {
        courseId,
        $$type: 'NewCourse',
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
        await monitorContract();
      } catch (error: any) {
        setErrorContract(
          `Transaction failed or was rejected. ${error?.message}`
        );
      }
    },
  };
}
