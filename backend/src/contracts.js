const { queryContractInfo } = require("./db-utils");

async function getContractInfo(accountId) {
  const contractInfo = await queryContractInfo(accountId);
  if (!contractInfo) {
    return undefined;
  }
  return {
    blockTimestamp: parseInt(contractInfo.block_timestamp),
    hash: contractInfo.hash,
  };
}

exports.getContractInfo = getContractInfo;
