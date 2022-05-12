import { ContractInfo } from "./client-types";
import { queryContractInfo } from "./db-utils";

async function getContractInfo(
  accountId: string
): Promise<ContractInfo | null> {
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
