const nearApi = require("near-api-js");

const BN = require("bn.js");

const { nearRpcUrl } = require("./config");

const nearRpc = new nearApi.providers.JsonRpcProvider(nearRpcUrl);

let seatPrice = null;
let totalStake = null;

// TODO: Provide an equivalent method in near-api-js, so we don't need to hack it around.
nearRpc.callViewMethod = async function (contractName, methodName, args) {
  const account = new nearApi.Account({ provider: this });
  return await account.viewFunction(contractName, methodName, args);
};

const queryFinalTimestamp = async () => {
  const finalBlock = await nearRpc.sendJsonRpc("block", { finality: "final" });
  return finalBlock.header.timestamp_nanosec;
};

const queryNodeStats = async () => {
  let genesisConfig = await nearRpc.sendJsonRpc(
    "EXPERIMENTAL_protocol_config",
    { finality: "final" }
  );
  let epochStatus = await nearRpc.sendJsonRpc("validators", [null]);
  let numSeats =
    genesisConfig.num_block_producer_seats +
    genesisConfig.avg_hidden_validator_seats_per_shard.reduce((a, b) => a + b);
  let currentProposals = epochStatus.current_proposals;
  let currentValidators = getCurrentNodes(epochStatus);

  if (!seatPrice) {
    seatPrice = nearApi.validators
      .findSeatPrice(epochStatus.current_validators, numSeats)
      .toString();
  }

  if (!totalStake) {
    totalStake = currentValidators
      .reduce((acc, node) => acc.add(new BN(node.stake)), new BN(0))
      .toString();
  }
  let { epoch_start_height: epochStartHeight } = epochStatus;

  return {
    currentValidators,
    currentProposals,
    seatPrice,
    totalStake,
    epochStartHeight,
  };
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

const fetchValidatorsInfo = async (validators, validatorArray) => {
  for (let i = 0; i < validators.length; i++) {
    const { account_id } = validators[i];
    let validator = validatorArray.get(account_id);
    let fee = validator?.fee;
    let delegators = validator?.delegators;

    if (fee) {
      validators[i].fee = fee;
    }
    if (delegators) {
      validators[i].delegators = delegators;
    }
    fee = await nearRpc.callViewMethod(
      account_id,
      "get_reward_fee_fraction",
      {}
    );
    delegators = await nearRpc.callViewMethod(
      account_id,
      "get_number_of_accounts",
      {}
    );
    validatorArray.set(account_id, { fee, delegators });
  }
  return validators;
};

const getCurrentNodes = (epochStatus) => {
  let currentValidators = epochStatus.current_validators;
  let nextValidators = epochStatus.next_validators;
  const {
    newValidators,
    removedValidators,
  } = nearApi.validators.diffEpochValidators(currentValidators, nextValidators);
  signNewValidators(newValidators);
  signRemovedValidators(removedValidators);
  currentValidators = currentValidators.concat(newValidators);
  return currentValidators;
};

exports.nearRpc = nearRpc;
exports.queryFinalTimestamp = queryFinalTimestamp;
exports.queryNodeStats = queryNodeStats;
exports.fetchValidatorsInfo = fetchValidatorsInfo;
