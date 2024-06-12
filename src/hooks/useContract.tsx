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
  const specialCourseContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = await Course.fromInit(courseId, coursePriceInNano);
    return client.open(contract) as OpenedContract<Course>;
  }, [client]);

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
          value: toNano('0.2'),
        },
        message
      );
    },

    purchaseCourse: () => {
      specialCourseContract?.send(
        sender,
        {
          value: coursePriceInNano + toNano('1'),
        },
        'New purchase'
      );
    },
  };
}
