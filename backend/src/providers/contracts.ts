import { queryContractInfo } from "../database/queries";

export const getContractInfo = async (
  accountId: string
): Promise<{ blockTimestamp: number; hash: string } | null> => {
  const contractInfo = await queryContractInfo(accountId);
  if (!contractInfo) {
    return null;
  }
  return {
    blockTimestamp: parseInt(contractInfo.block_timestamp),
    hash: contractInfo.hash,
  };
};
