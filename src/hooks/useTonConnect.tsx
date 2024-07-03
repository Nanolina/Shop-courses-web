import { Address, Sender, SenderArguments, toNano } from '@ton/core';
import { CHAIN, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { encodeSaleMessage } from '../functions';
import { Course } from '../ton/wrappers/Course';
import { ICourse } from '../types';

const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

export function useTonConnect(
  course?: ICourse // only for purchase
): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [courseContractAddress, setCourseContractAddress] =
    useState<string>('');

  const getCourseContractAddress = useCallback(async () => {
    try {
      if (!course) return;
      const coursePriceInNano = toNano(course.price.toString());
      const contractByData = await Course.fromInit(
        course.id,
        coursePriceInNano,
        BigInt(course.userId)
      );
      const contractAddress = contractByData.address.toString();
      setCourseContractAddress(contractAddress);
    } catch (error) {}
  }, [course]);

  useEffect(() => {
    getCourseContractAddress();
  }, [getCourseContractAddress]);

  return {
    sender: {
      send: async (args: SenderArguments) => {
        const messages: any = [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString('base64'),
          },
        ];

        // Adding a transaction to course contract with message Sale type
        if (course) {
          messages.push({
            address: courseContractAddress,
            amount: toNano(course?.price.toString()).toString(),
            payload: encodeSaleMessage(isProduction),
          });
        }

        tonConnectUI.sendTransaction({
          messages,
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
