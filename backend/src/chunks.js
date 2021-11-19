const { queryGasUsedInChunks } = require("./db-utils");
const BN = require("bn.js");

async function getGasUsedInChunks(blockHash) {
  const gasUsedInChunks = await queryGasUsedInChunks(blockHash);
  if (!gasUsedInChunks) {
    return undefined;
  }
  return gasUsedInChunks;
}

exports.getGasUsedInChunks = getGasUsedInChunks;
