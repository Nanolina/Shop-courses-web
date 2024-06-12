import { Address, OpenedContract, toNano } from '@ton/core';
import { NewPurchase, Purchase } from '../ton/wrappers/Purchase';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function useContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const purchaseContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress: any =
      process.env.REACT_APP_PURCHASE_CONTRACT_ADDRESS;

    const contract = Purchase.fromAddress(Address.parse(contractAddress));

    return client.open(contract) as OpenedContract<Purchase>;
  }, [client]);

  return {
    purchaseCourse: (courseId: string, coursePrice: number, seller: string) => {
      const message: NewPurchase = {
        $$type: 'NewPurchase',
        courseId,
        coursePrice: toNano(coursePrice),
        seller: Address.parse(seller),
      };
      purchaseContract?.send(
        sender,
        {
          value: toNano('10'),
        },
        message
      );
    },
  };
}
