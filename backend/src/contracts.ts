import { queryContractInfo } from "./db-utils";

async function getContractInfo(
  accountId: string
): Promise<{ blockTimestamp: number; hash: string } | null> {
  const contractInfo = await queryContractInfo(accountId);
  if (!contractInfo) {
    return null;
  }
  return {
    blockTimestamp: parseInt(contractInfo.block_timestamp),
    hash: contractInfo.hash,
  };
}

export { getContractInfo };
