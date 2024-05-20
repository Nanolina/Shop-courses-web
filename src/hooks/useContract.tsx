import { Address, OpenedContract, toNano } from '@ton/core';
import { Factory, NewSeller } from '../ton/wrappers/Factory';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function useContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const factoryContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS;

    const contract = await Factory.fromAddress(Address.parse(contractAddress));

    return client.open(contract) as OpenedContract<Factory>;
  }, [client]);

  return {
    createCourse: (courseId: string, coursePrice: bigint) => {
      const message: NewSeller = {
        $$type: 'NewSeller',
        courseId,
        coursePrice,
      };
      factoryContract?.send(
        sender,
        {
          value: toNano('1'),
        },
        message
      );
    },
  };
}
