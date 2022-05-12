import { queryGasUsedInChunks } from "./db-utils";

async function getGasUsedInChunks(blockHash: string): Promise<string | null> {
  const result = await queryGasUsedInChunks(blockHash);
  if (!result || !result.gas_used) {
    return null;
  }
  return result.gas_used;
}

export { getGasUsedInChunks };
