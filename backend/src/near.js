const nearlib = require("nearlib");

const { nearRpcUrl } = require("./config");

const nearRpc = new nearlib.providers.JsonRpcProvider(nearRpcUrl);

const queryFinalTimestamp = async () => {
  const finalBlock = await nearRpc.sendJsonRpc("block", { finality: "final" });
  return finalBlock.header.timestamp;
};

const queryValidatorAmount = async () => {
  const validators = await nearRpc.sendJsonRpc("validators", [null]);
  return validators.current_validators.length;
};

exports.nearRpc = nearRpc;
exports.queryFinalTimestamp = queryFinalTimestamp;
exports.queryValidatorAmount = queryValidatorAmount;
