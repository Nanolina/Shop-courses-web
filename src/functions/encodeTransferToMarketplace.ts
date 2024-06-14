import { Builder } from '@ton/core';
import { CourseActionType } from '../types';

//function storeTransferToMarketplace from src/ton/build
export function encodeTransferToMarketplace(
  courseId?: string,
  courseActionType?: CourseActionType
) {
  if (!courseId || !courseActionType) return;
  const opcode = parseFloat(
    process.env.REACT_APP_MARKETPLACE_FEE_CONTRACT_OPCODE || ''
  );
  let builder = new Builder();
  builder.storeUint(opcode, 32); // MarketplaceFee contract
  builder.storeStringRefTail(courseId);
  builder.storeStringRefTail(courseActionType);
  return builder.asCell().toBoc().toString('base64');
}
