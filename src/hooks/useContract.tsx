import { Address, OpenedContract, toNano } from '@ton/core';
import { NewSeller, Seller } from '../ton/wrappers/Seller';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function useContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const sellerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any = process.env.REACT_APP_SELLER_CONTRACT_ADDRESS;

    const contract = await Seller.fromAddress(Address.parse(contractAddress));

    return client.open(contract) as OpenedContract<Seller>;
  }, [client]);

  return {
    createCourse: (courseId: string) => {
      const message: NewSeller = {
        $$type: 'NewSeller',
        courseId,
      };
      sellerContract?.send(
        sender,
        {
          value: toNano('1'),
        },
        message
      );
    },
  };
}
