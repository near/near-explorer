const { queryGasUsedInChunks } = require("./db-utils");
const BN = require("bn.js");

async function getGasUsedInChunks(blockHash) {
  const gasUsedInChunks = await queryGasUsedInChunks(blockHash);
  if (!gasUsedInChunks) {
    return undefined;
  }
  return gasUsedInChunks
    .reduce((currentGas, chunk) => {
      currentGas.iadd(new BN(chunk.gas_used));
      return currentGas;
    }, new BN(0))
    .toString();
}

exports.getGasUsedInChunks = getGasUsedInChunks;
