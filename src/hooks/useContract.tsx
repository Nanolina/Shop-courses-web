import { OpenedContract, address, toNano } from '@ton/core';
import { Course, NewCourse } from '../ton/wrappers/Course';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function useContract(courseId: string, coursePrice: number) {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

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

  async function isContractDeployed() {
    try {
      const contractByData = await Course.fromInit(courseId, coursePriceInNano);
      const contractAddress = address(contractByData.address.toString());

      const contract = await client?.getContractState(contractAddress);
      return contract?.state;
    } catch (error) {
      console.error('Error checking contract deployment:', error);
      return false;
    }
  }

  return {
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

    isContractDeployed,
  };
}
