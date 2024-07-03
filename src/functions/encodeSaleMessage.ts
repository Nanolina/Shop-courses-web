import { Builder } from '@ton/core';

// Function storeSale from src/ton/build
export function encodeSaleMessage(isProduction: boolean) {
  if (!isProduction) return;
  const opcode = parseFloat(
    process.env.REACT_APP_SALE_MESSAGE_COURSE_CONTRACT_OPCODE || ''
  );
  let builder = new Builder();
  builder.storeUint(opcode, 32); // Course contract
  builder.storeBit(isProduction);
  return builder.asCell().toBoc().toString('base64');
}
