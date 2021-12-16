const nearApi = require("near-api-js");

const BN = require("bn.js");

const { nearArchivalRpcUrl } = require("./config");
const { queryNodeValidators } = require("./db-utils");

const nearRpc = new nearApi.providers.JsonRpcProvider({
  url: nearArchivalRpcUrl,
});

let seatPrice = null;
let totalStake = null;
let currentEpochStartHeight = null;
let stakingNodes = new Map();

// TODO: Provide an equivalent method in near-api-js, so we don't need to hack it around.
nearRpc.callViewMethod = async function (contractName, methodName, args) {
  const account = new nearApi.Account({ provider: this });
  return await account.viewFunction(contractName, methodName, args);
};

const queryFinalBlock = async () => {
  return await nearRpc.sendJsonRpc("block", { finality: "final" });
};

const queryEpochStats = async () => {
  const networkProtocolConfig = await nearRpc.sendJsonRpc(
    "EXPERIMENTAL_protocol_config",
    { finality: "final" }
  );
  const epochStatus = await nearRpc.sendJsonRpc("validators", [null]);
  const maxNumberOfSeats =
    networkProtocolConfig.num_block_producer_seats +
    networkProtocolConfig.avg_hidden_validator_seats_per_shard.reduce(
      (a, b) => a + b
    );

  const currentProposals = epochStatus.current_proposals;
  const currentNodes = getCurrentNodes(epochStatus);
  const currentPools = await queryNodeValidators();

  // collect all ids
  const currentPoolsIds = new Set([
    ...currentPools.map(({ account_id }) => account_id),
    ...currentNodes.map(({ account_id }) => account_id),
    ...currentProposals.map(({ account_id }) => account_id),
  ]);

  // collect current validators and proposal to separate Map()
  // to keep their list up-to-date
  const currentValidatorsMap = new Map();
  const currentProposalsMap = new Map();
  currentNodes.forEach((i) => {
    currentValidatorsMap.set(i.account_id, i);
  });
  currentProposals.forEach((v) => {
    currentProposalsMap.set(v.account_id, v);
  });

  // loop over all pools and

  for (const stakingPool of currentPoolsIds) {
    const activeValidator = currentValidatorsMap.get(stakingPool);
    const proposalValidator = currentProposalsMap.get(stakingPool);
    // if current validator included in list of proposals
    // we add proposedStake to this validator because of different
    // amount of stake from current to next epoch
    if (activeValidator && proposalValidator) {
      stakingNodes.set(stakingPool, {
        ...activeValidator,
        proposedStake: proposalValidator.stake,
      });
    } else if (activeValidator && !proposalValidator) {
      // if current validators isn't included in proposals list
      // we display it as is (mostly for 'leaving' stakingStatus)
      stakingNodes.set(stakingPool, {
        ...activeValidator,
      });
    } else if (!activeValidator && proposalValidator) {
      // if proposal validator isn't included in current validators list
      // we display it with "proposal" stakingStatus
      // and only 'proposedStake' instead of 'currentStake'
      const { stake, ...proposal } = proposalValidator;
      stakingNodes.set(stakingPool, {
        ...proposal,
        proposedStake: stake,
        stakingStatus: "proposal",
      });
    } else {
      // if some validator isn't included in current and proposal
      // we just push 'account_id' to query for 'fee', 'delegators', 'stake'
      // from rpc and 'name.near' contract
      stakingNodes.set(stakingPool, {
        account_id: stakingPool,
      });
    }
  }

  const {
    epoch_start_height: epochStartHeight,
    current_validators: currentValidators,
  } = epochStatus;
  const {
    epoch_length: epochLength,
    genesis_time: genesisTime,
    genesis_height: genesisHeight,
    protocol_version: epochProtocolVersion,
  } = networkProtocolConfig;
  const currentEpochValidatingNodes = currentNodes.filter(
    (node) => ["active", "leaving"].indexOf(node.stakingStatus) >= 0
  );

  if (currentEpochStartHeight !== epochStartHeight) {
    // Update seat_price and total_stake each time when epoch starts
    const {
      minimum_stake_ratio: epochMinStakeRatio,
    } = await nearRpc.sendJsonRpc("EXPERIMENTAL_genesis_config", {});
    currentEpochStartHeight = epochStartHeight;
    // for 'protocol_version' less then 49 'epochMinStakeRatio' = undefined
    // and it works correct because 'findSeatPrice' method handles this
    seatPrice = nearApi.validators
      .findSeatPrice(
        currentValidators,
        maxNumberOfSeats,
        epochMinStakeRatio,
        epochProtocolVersion
      )
      .toString();

    totalStake = currentValidators
      .reduce((acc, node) => acc.add(new BN(node.stake)), new BN(0))
      .toString();
  }

  return {
    epochLength,
    epochStartHeight,
    epochProtocolVersion,
    // we must kick of 'joining' validators as they are not part of current epoch
    currentValidators: currentEpochValidatingNodes,
    stakingNodes,
    totalStake,
    seatPrice,
    genesisTime,
    genesisHeight,
  };
};

const setValidatorStatus = (validators, status) => {
  return validators.map((v) => {
    const { stake, ...validator } = v;
    return {
      ...validator,
      currentStake: stake,
      stakingStatus: status,
    };
  });
};

const getCurrentNodes = (epochStatus) => {
  let {
    current_validators: currentValidators,
    next_validators: nextValidators,
  } = epochStatus;

  let {
    newValidators,
    removedValidators,
  } = nearApi.validators.diffEpochValidators(currentValidators, nextValidators);

  const removedValidatorsSet = new Set(
    removedValidators.map((i) => i.account_id)
  );
  const activeValidators = currentValidators.filter(
    (v) => !removedValidatorsSet.has(v.account_id)
  );

  nextValidators = setValidatorStatus(newValidators, "joining");
  removedValidators = setValidatorStatus(removedValidators, "leaving");
  currentValidators = setValidatorStatus(activeValidators, "active");

  return [...currentValidators, ...nextValidators, ...removedValidators];
};

async function getStakingNodesList() {
  if (stakingNodes.size === 0) {
    await queryEpochStats();
  }
  return stakingNodes;
}

exports.nearRpc = nearRpc;
exports.queryFinalBlock = queryFinalBlock;
exports.queryEpochStats = queryEpochStats;
exports.getStakingNodesList = getStakingNodesList;
