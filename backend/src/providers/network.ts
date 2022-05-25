import { queryOnlineNodesCount } from "../database/queries";
import {
  RPC,
  ValidationProgress,
  ValidatorEpochData,
  NetworkStats,
  CurrentEpochState,
} from "../types";
import * as nearApi from "../utils/near";

export const queryFinalBlock = async (): Promise<
  RPC.ResponseMapping["block"]
> => {
  return await nearApi.sendJsonRpc("block", {
    finality: "final",
  });
};

const mapProgress = (
  currentValidator: RPC.CurrentEpochValidatorInfo
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
  epochStatus: RPC.EpochValidatorInfo,
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
  currentEpochState: CurrentEpochState | null,
  epochStatus: RPC.EpochValidatorInfo,
  networkProtocolConfig: RPC.ProtocolConfigView
) => {
  if (currentEpochState?.height === epochStatus.epoch_start_height) {
    return currentEpochState;
  }

  const { minimum_stake_ratio: epochMinStakeRatio } = await nearApi.sendJsonRpc(
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
      .reduce((acc, node) => acc + BigInt(node.stake), 0n)
      .toString(),
  };
  return currentEpochState;
};

type EpochData = {
  stats: NetworkStats;
  validators: ValidatorEpochData[];
};

export const queryEpochData = async (
  poolIds: string[],
  currentEpochState: CurrentEpochState | null
): Promise<EpochData> => {
  const [
    networkProtocolConfig,
    epochStatus,
    onlineNodesCount,
  ] = await Promise.all([
    nearApi.sendJsonRpc("EXPERIMENTAL_protocol_config", { finality: "final" }),
    nearApi.sendJsonRpc("validators", [null]),
    queryOnlineNodesCount(),
  ]);
  const epochState = await getEpochState(
    currentEpochState,
    epochStatus,
    networkProtocolConfig
  );

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
