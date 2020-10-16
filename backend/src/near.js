const nearApi = require("near-api-js");

const { nearRpcUrl, wampNearNetworkName } = require("./config");

const nearRpc = new nearApi.providers.JsonRpcProvider(nearRpcUrl);

// TODO: Provide an equivalent method in near-api-js, so we don't need to hack it around.
nearRpc.callViewMethod = async function (contractName, methodName, args) {
  const account = new nearApi.Account({ provider: this });
  return await account.viewFunction(contractName, methodName, args);
};

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
  } = nearApi.validators.diffEpochValidators(currentValidators, nextValidators);
  signNewValidators(newValidators);
  signRemovedValidators(removedValidators);
  currentValidators = currentValidators.concat(newValidators);
  return currentValidators;
};

const getPhase2VoteStats = async (contractName) => {
  const account = new nearApi.Account({ provider: nearRpc });
  const [totalVotes, totalStake] = await account.viewFunction(
    contractName,
    "get_total_voted_stake",
    {}
  );
  return { totalVotes, totalStake };
};

exports.nearRpc = nearRpc;
exports.callViewMethod = callViewMethod;
exports.queryFinalTimestamp = queryFinalTimestamp;
exports.queryNodeStats = queryNodeStats;
exports.getPhase2VoteStats = getPhase2VoteStats;
