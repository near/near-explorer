import * as nearApi from "near-api-js";

import BN from "bn.js";

import { config } from "./config";
import { queryOnlineNodesCount } from "./db-utils";
import {
  NetworkStats,
  ValidationProgress,
  ValidatorEpochData,
} from "./client-types";
import {
  RpcQueryRequestTypeMapping,
  RpcQueryResponseNarrowed,
  RpcResponseMapping,
  EpochValidatorInfo,
  CurrentEpochValidatorInfo,
  ProtocolConfigView,
} from "./rpc-types";

type CurrentEpochState = {
  seatPrice: string;
  totalStake: string;
  height: number;
};
let currentEpochState: CurrentEpochState | null = null;

const nearRpc = new nearApi.providers.JsonRpcProvider({
  url: config.archivalRpcUrl,
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

const mapProgress = (
  currentValidator: CurrentEpochValidatorInfo
): ValidationProgress => {
  return {
    blocks: {
      produced: currentValidator.num_produced_blocks,
      total: currentValidator.num_expected_blocks,
    },
    chunks: {
      produced: currentValidator.num_produced_chunks,
      total: currentValidator.num_expected_chunks,
    },
  };
};

const mapValidators = (
  epochStatus: EpochValidatorInfo,
  poolIds: string[]
): ValidatorEpochData[] => {
  const validatorsMap: Map<string, ValidatorEpochData> = new Map();

  for (const currentValidator of epochStatus.current_validators) {
    validatorsMap.set(currentValidator.account_id, {
      accountId: currentValidator.account_id,
      publicKey: currentValidator.public_key,
      currentEpoch: {
        stake: currentValidator.stake,
        progress: mapProgress(currentValidator),
      },
    });
  }

  for (const nextValidator of epochStatus.next_validators) {
    const validator = validatorsMap.get(nextValidator.account_id) || {
      accountId: nextValidator.account_id,
      publicKey: nextValidator.public_key,
    };
    validator.nextEpoch = {
      stake: nextValidator.stake,
    };
    validatorsMap.set(nextValidator.account_id, validator);
  }

  for (const nextProposal of epochStatus.current_proposals) {
    const validator = validatorsMap.get(nextProposal.account_id) || {
      accountId: nextProposal.account_id,
      publicKey: nextProposal.public_key,
    };
    validator.afterNextEpoch = {
      stake: nextProposal.stake,
    };
    validatorsMap.set(nextProposal.account_id, validator);
  }

  for (const accountId of poolIds) {
    const validator = validatorsMap.get(accountId) || {
      accountId: accountId,
    };
    validatorsMap.set(accountId, validator);
  }

  return [...validatorsMap.values()];
};

const getEpochState = async (
  epochStatus: EpochValidatorInfo,
  networkProtocolConfig: ProtocolConfigView
) => {
  if (currentEpochState?.height === epochStatus.epoch_start_height) {
    return currentEpochState;
  }

  const { minimum_stake_ratio: epochMinStakeRatio } = await sendJsonRpc(
    "EXPERIMENTAL_genesis_config",
    {}
  );
  const maxNumberOfSeats =
    networkProtocolConfig.num_block_producer_seats +
    networkProtocolConfig.avg_hidden_validator_seats_per_shard.reduce(
      (sum, seat) => sum + seat,
      0
    );
  currentEpochState = {
    height: epochStatus.epoch_start_height,
    seatPrice: nearApi.validators
      .findSeatPrice(
        epochStatus.current_validators,
        maxNumberOfSeats,
        epochMinStakeRatio,
        networkProtocolConfig.protocol_version
      )
      .toString(),
    totalStake: epochStatus.current_validators
      .reduce((acc, node) => acc.add(new BN(node.stake)), new BN(0))
      .toString(),
  };
  return currentEpochState;
};

type EpochData = {
  stats: NetworkStats;
  validators: ValidatorEpochData[];
};

const queryEpochData = async (poolIds: string[]): Promise<EpochData> => {
  const [
    networkProtocolConfig,
    epochStatus,
    onlineNodesCount,
  ] = await Promise.all([
    sendJsonRpc("EXPERIMENTAL_protocol_config", { finality: "final" }),
    sendJsonRpc("validators", [null]),
    queryOnlineNodesCount(),
  ]);
  const epochState = await getEpochState(epochStatus, networkProtocolConfig);

  return {
    stats: {
      epochLength: networkProtocolConfig.epoch_length,
      epochStartHeight: epochStatus.epoch_start_height,
      epochProtocolVersion: networkProtocolConfig.protocol_version,
      currentValidatorsCount: epochStatus.current_validators.length,
      totalStake: epochState.totalStake,
      seatPrice: epochState.seatPrice,
      genesisTime: networkProtocolConfig.genesis_time,
      genesisHeight: networkProtocolConfig.genesis_height,
      onlineNodesCount,
    },
    validators: mapValidators(epochStatus, poolIds),
  };
};

export { queryFinalBlock, queryEpochData, callViewMethod };
