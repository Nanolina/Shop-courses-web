import { Address, Sender, SenderArguments, toNano } from '@ton/core';
import { CHAIN, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { encodeTransferToMarketplace } from '../functions';
import { CourseActionType } from '../types';

export function useTonConnect(
  courseId?: string,
  courseActionType?: CourseActionType
): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const marketplaceFeeAddress =
    process.env.REACT_APP_MARKETPLACE_FEE_CONTRACT_ADDRESS || '';

  return {
    sender: {
      send: async (args: SenderArguments) => {
        const messages = [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString('base64'),
          },
        ];

        // Adding a transaction to marketplaceFee contract
        if (courseId) {
          messages.push({
            address: marketplaceFeeAddress.toString(),
            amount: toNano('0.6').toString(),
            payload: encodeTransferToMarketplace(courseId, courseActionType),
          });
        }

        tonConnectUI.sendTransaction({
          messages: messages,
          validUntil: Date.now() + 5 * 60 * 1000, // 5 min
        });
      },
      address: wallet?.account.address
        ? Address.parse(wallet.account.address as string)
        : undefined,
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain ?? null,
  };
}
