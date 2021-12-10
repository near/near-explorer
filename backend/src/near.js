const nearApi = require("near-api-js");

const BN = require("bn.js");

const { nearRpcUrl } = require("./config");
const { queryNodeValidators } = require("./db-utils");

const nearRpc = new nearApi.providers.JsonRpcProvider({
  url: nearRpcUrl,
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

  // loop over 'active' validators to push those validators to common Map()
  currentNodes.forEach((node, i) => {
    const { stake, ...currentNode } = node;
    stakingNodes.set(node.account_id, {
      ...currentNode,
      currentStake: stake,
      stakingStatus: currentNodes[i].stakingStatus,
    });
  });

  // loop over proposed validators to apply stakingStatus='proposal'
  // and if proposed validators already exist in common Map()
  // we add proposedStake to this validator because of different
  // amount of stake from current to next epoch
  currentProposals.forEach((proposal) => {
    const { stake, ...proposalValidator } = proposal;
    const activeValidator = stakingNodes.get(proposal.account_id);

    if (activeValidator) {
      stakingNodes.set(proposal.account_id, {
        ...activeValidator,
        proposedStake: proposal.stake,
      });
    } else {
      stakingNodes.set(proposal.account_id, {
        ...proposalValidator,
        proposedStake: stake,
        stakingStatus: "proposal",
      });
    }
  });

  // loop over all pools from 'name.near' account
  // to get metadata about those accounts (country, country flag, ect.) and
  // push them to commom Map().
  // this data will be shown on 'mainnet' only because 'name.near' exists only there
  currentPools.forEach((pool) => {
    const activePool = stakingNodes.get(pool.account_id);
    if (activePool) {
      stakingNodes.set(pool.account_id, {
        ...activePool,
      });
    } else {
      stakingNodes.set(pool.account_id, {
        account_id: pool.account_id,
      });
    }
  });

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

    totalStake = currentNodes
      .reduce((acc, node) => acc.add(new BN(node.stake)), new BN(0))
      .toString();
  }

  return {
    epochLength,
    epochStartHeight,
    epochProtocolVersion,
    // we must kick of 'joining' validators as they are not part of current epoch
    currentValidators: currentNodes.filter(
      (i) => ["active", "leaving"].indexOf(i.stakingStatus) >= 0
    ),
    stakingNodes,
    totalStake,
    seatPrice,
    genesisTime,
    genesisHeight,
  };
};

const setValidatorStatus = (validators, status) => {
  for (let i = 0; i < validators.length; i++) {
    validators[i].stakingStatus = status;
  }
};

const getCurrentNodes = (epochStatus) => {
  let {
    current_validators: currentValidators,
    next_validators: nextValidators,
  } = epochStatus;
  const {
    newValidators,
    removedValidators,
  } = nearApi.validators.diffEpochValidators(currentValidators, nextValidators);
  setValidatorStatus(currentValidators, "active");
  setValidatorStatus(newValidators, "joining");
  setValidatorStatus(removedValidators, "leaving");
  currentValidators = currentValidators.concat(newValidators);
  return currentValidators;
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
