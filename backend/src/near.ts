import * as nearApi from "near-api-js";

import BN from "bn.js";

import { nearArchivalRpcUrl } from "./config";
import { queryNodeValidators } from "./db-utils";
import { NetworkStats, StakingStatus } from "./client-types";
import {
  CurrentEpochValidatorInfo,
  NextEpochValidatorInfo,
} from "near-api-js/lib/providers/provider";
import {
  RpcQueryRequestTypeMapping,
  RpcQueryResponseNarrowed,
  RpcResponseMapping,
} from "./rpc-types";

const nearRpc = new nearApi.providers.JsonRpcProvider({
  url: nearArchivalRpcUrl,
});

export const sendJsonRpc = <M extends keyof RpcResponseMapping>(
  method: M,
  args: object
): Promise<RpcResponseMapping[M]> => {
  return nearRpc.sendJsonRpc(method, args);
};

export const sendJsonRpcQuery = <K extends keyof RpcQueryRequestTypeMapping>(
  requestType: K,
  args: object
): Promise<RpcQueryResponseNarrowed<K>> => {
  return nearRpc.sendJsonRpc<RpcQueryResponseNarrowed<K>>("query", {
    request_type: requestType,
    ...args,
  });
};

let seatPrice: string = "0";
let totalStake: string = "0";
let currentEpochStartHeight: number = -1;

type ActiveValidator = CurrentNode & { proposedStake: string };
type LeavingValidator = CurrentNode;
type JoiningValidator = Omit<
  RpcResponseMapping["validators"]["current_proposals"][number],
  "stake"
> & {
  proposedStake: string;
  stakingStatus: "proposal";
};
type NotUsedValidator = { account_id: string };

export type StakingNode =
  | ActiveValidator
  | LeavingValidator
  | JoiningValidator
  | NotUsedValidator;

let stakingNodes = new Map<string, StakingNode>();

// TODO: Provide an equivalent method in near-api-js, so we don't need to make it external.
const callViewMethod = async function <T>(
  contractName: string,
  methodName: string,
  args: unknown
): Promise<T> {
  const account = new nearApi.Account(
    ({
      provider: nearRpc,
    } as unknown) as nearApi.Connection,
    "near"
  );
  return await account.viewFunction(contractName, methodName, args);
};

const queryFinalBlock = async (): Promise<RpcResponseMapping["block"]> => {
  return await sendJsonRpc("block", {
    finality: "final",
  });
};

const queryEpochStats = async (): Promise<
  Pick<
    NetworkStats,
    | "epochLength"
    | "epochStartHeight"
    | "epochProtocolVersion"
    | "totalStake"
    | "seatPrice"
    | "genesisTime"
    | "genesisHeight"
  > & {
    currentValidators: CurrentNode[];
    stakingNodes: Map<string, StakingNode>;
  }
> => {
  const networkProtocolConfig = await sendJsonRpc(
    "EXPERIMENTAL_protocol_config",
    { finality: "final" }
  );
  const epochStatus = await sendJsonRpc("validators", [null]);
  const maxNumberOfSeats =
    networkProtocolConfig.num_block_producer_seats +
    networkProtocolConfig.avg_hidden_validator_seats_per_shard.reduce(
      (a, b) => a + b
    );

  const currentProposals = epochStatus.current_proposals;
  const currentNodes = getCurrentNodes(epochStatus);
  const currentPools = await queryNodeValidators();

  // collect all ids
  const currentPoolsIds = new Set<string>([
    ...currentPools.map(({ account_id }) => account_id),
    ...currentNodes.map(({ account_id }) => account_id),
    ...currentProposals.map(({ account_id }) => account_id),
  ]);

  // collect current validators and proposal to separate Map()
  // to keep their list up-to-date
  const currentValidatorsMap = new Map<string, CurrentNode>();
  const currentProposalsMap = new Map<
    string,
    RpcResponseMapping["validators"]["current_proposals"][number]
  >();
  currentNodes.forEach((rawNode) => {
    const node = rawNode as CurrentNodeModifier<
      RpcResponseMapping["validators"]["current_validators"][number]
    >;
    if (
      "num_produced_blocks" in node &&
      "num_expected_blocks" in node &&
      "num_produced_chunks" in node &&
      "num_expected_chunks" in node &&
      node.num_expected_blocks !== 0
    ) {
      const {
        num_produced_blocks,
        num_expected_blocks,
        num_produced_chunks,
        num_expected_chunks,
        ...restNode
      } = node;
      currentValidatorsMap.set(restNode.account_id, {
        ...restNode,
        progress: {
          blocks: {
            produced: num_produced_blocks,
            total: num_expected_blocks,
          },
          chunks: {
            produced: num_produced_chunks,
            total: num_expected_chunks,
          },
        },
      });
    }
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
  const currentEpochValidatingNodes = currentNodes.filter((node) =>
    ["active", "leaving"].includes(node.stakingStatus)
  );

  if (currentEpochStartHeight !== epochStartHeight) {
    // Update seat_price and total_stake each time when epoch starts
    const { minimum_stake_ratio: epochMinStakeRatio } = await sendJsonRpc(
      "EXPERIMENTAL_genesis_config",
      {}
    );
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

type CurrentNodeModifier<T extends { stake: string }> = Omit<T, "stake"> & {
  currentStake: string;
  stakingStatus: StakingStatus;
};

export type CurrentNode = CurrentNodeModifier<
  | NextEpochValidatorInfo
  | CurrentEpochValidatorInfo
  | RpcResponseMapping["validators"]["current_validators"][number]
> & {
  progress?: Record<
    "blocks" | "chunks",
    {
      produced: number;
      total: number;
    }
  >;
};

const setValidatorStatus = <T extends { stake: string }>(
  validators: T[],
  status: StakingStatus
): CurrentNodeModifier<T>[] => {
  return validators.map((v) => {
    const { stake, ...validator } = v;
    return {
      ...validator,
      currentStake: stake,
      stakingStatus: status,
    };
  });
};

const getCurrentNodes = (
  epochStatus: RpcResponseMapping["validators"]
): CurrentNode[] => {
  let epochValidatorsDiff = nearApi.validators.diffEpochValidators(
    epochStatus.current_validators,
    epochStatus.next_validators
  );

  const removedValidatorsSet = new Set(
    epochValidatorsDiff.removedValidators.map((i) => i.account_id)
  );
  const activeValidators = epochStatus.current_validators.filter(
    (v) => !removedValidatorsSet.has(v.account_id)
  );

  const nextValidators = setValidatorStatus(
    epochValidatorsDiff.newValidators,
    "joining"
  );
  const removedValidators = setValidatorStatus(
    epochValidatorsDiff.removedValidators,
    "leaving"
  );
  const currentValidators = setValidatorStatus(activeValidators, "active");

  return [...currentValidators, ...nextValidators, ...removedValidators];
};

async function getStakingNodesList(): Promise<Map<string, StakingNode>> {
  if (stakingNodes.size === 0) {
    await queryEpochStats();
  }
  return stakingNodes;
}

export {
  queryFinalBlock,
  queryEpochStats,
  getStakingNodesList,
  callViewMethod,
};
