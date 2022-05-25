import { queryGasUsedInChunks } from "../database/queries";

export const getGasUsedInChunks = async (
  blockHash: string
): Promise<string | null> => {
  const result = await queryGasUsedInChunks(blockHash);
  if (!result || !result.gas_used) {
    return null;
  }
  return result.gas_used;
};
