import { Builder } from '@ton/core';

const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

/**
 * Attention!
 * When making changes to the Course smart contract,
 * be sure to check the compliance of its opcode
 * in the src/ton/build directory.
 * This is necessary to prevent errors
 * and ensure correct operation of the contract
 */

// Function storeSale from src/ton/build
export function encodeSaleMessage() {
  const opcode = parseFloat(
    process.env.REACT_APP_SALE_MESSAGE_COURSE_CONTRACT_OPCODE || ''
  );
  let builder = new Builder();
  builder.storeUint(opcode, 32); // Course contract
  builder.storeBit(isProduction);
  return builder.asCell().toBoc().toString('base64');
}
