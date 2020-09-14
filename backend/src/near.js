const nearlib = require("near-api-js");

const { nearRpcUrl, wampNearNetworkName } = require("./config");

const nearRpc = new nearlib.providers.JsonRpcProvider(nearRpcUrl);

const queryFinalTimestamp = async () => {
  const finalBlock = await nearRpc.sendJsonRpc("block", { finality: "final" });
  return finalBlock.header.timestamp;
};

const queryNodeStats = async () => {
  let nodes = await nearRpc.sendJsonRpc("validators", [null]);
  let proposals = nodes.current_proposals;
  let currentValidators = getCurrentNodes(nodes);
  return { currentValidators, proposals };
};

const signNewValidators = (newValidators) => {
  for (let i = 0; i < newValidators.length; i++) {
    newValidators[i].new = true;
  }
};

const signRemovedValidators = (removedValidators) => {
  for (let i = 0; i < removedValidators.length; i++) {
    removedValidators[i].removed = true;
  }
};

const getCurrentNodes = (nodes) => {
  let currentValidators = nodes.current_validators;
  let nextValidators = nodes.next_validators;
  const {
    newValidators,
    removedValidators,
  } = nearlib.validators.diffEpochValidators(currentValidators, nextValidators);
  signNewValidators(newValidators);
  signRemovedValidators(removedValidators);
  currentValidators = currentValidators.concat(newValidators);
  return currentValidators;
};

const testnetConfig = {
  nodeUrl: "https://rpc.testnet.nearprotocol.com",
  networkId: "testnet",
  contractName: "transfer-vote.near",
};
const mainnetConfig = {
  nodeUrl: "https://rpc.mainnet.nearprotocol.com",
  networkId: "mainnet",
  contractName: "vote.f863973.m0",
};

const getVoteStats = async (config) => {
  const near = await nearlib.connect({
    nodeUrl: config.nodeUrl,
    networkId: config.networkId,
  });
  const account = await near.account(config.contractName);
  const totalStake = await account.viewFunction(
    config.contractName,
    "get_total_voted_stake",
    {}
  );
  const stakeMap = await account.viewFunction(
    config.contractName,
    "get_votes",
    {}
  );
};

exports.nearRpc = nearRpc;
exports.queryFinalTimestamp = queryFinalTimestamp;
exports.queryNodeStats = queryNodeStats;
