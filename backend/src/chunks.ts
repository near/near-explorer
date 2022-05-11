import { queryGasUsedInChunks } from "./db-utils";

export const getGasUsedInChunks = async (
  blockHash: string
): Promise<string | null> => {
  const result = await queryGasUsedInChunks(blockHash);
  if (!result || !result.gas_used) {
    return null;
  }
  return result.gas_used;
};
