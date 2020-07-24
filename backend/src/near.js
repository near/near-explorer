const nearlib = require("nearlib");

const { nearRpcUrl } = require("./config");

const nearRpc = new nearlib.providers.JsonRpcProvider(nearRpcUrl);

const queryFinalTimestamp = async () => {
  const finalBlock = await nearRpc.sendJsonRpc("block", { finality: "final" });
  return finalBlock.header.timestamp;
};

const queryNodeStats = async () => {
  return await nearRpc.sendJsonRpc("validators", [null]);
};

exports.nearRpc = nearRpc;
exports.queryFinalTimestamp = queryFinalTimestamp;
exports.queryNodeStats = queryNodeStats;
