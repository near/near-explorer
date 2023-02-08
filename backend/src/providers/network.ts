import { Context } from "@explorer/backend/context";
import {
  NetworkStats,
  ValidationProgress,
  ValidatorEpochData,
} from "@explorer/backend/router/types";
import * as nearApi from "@explorer/backend/utils/near";
import * as RPC from "@explorer/common/types/rpc";

export const queryFinalBlock = async (): Promise<
  RPC.ResponseMapping["block"]
> =>
  nearApi.sendJsonRpc("block", {
    finality: "final",
  });

const mapProgress = (
  currentValidator: RPC.CurrentEpochValidatorInfo
): ValidationProgress => ({
  blocks: {
    produced: currentValidator.num_produced_blocks,
    total: currentValidator.num_expected_blocks,
  },
  chunks: {
    produced: currentValidator.num_produced_chunks,
    total: currentValidator.num_expected_chunks,
  },
});

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
      accountId,
    };
    validatorsMap.set(accountId, validator);
  }

  return [...validatorsMap.values()];
};

const getEpochState = async (
  context: Context,
  epochStatus: RPC.EpochValidatorInfo,
  networkProtocolConfig: RPC.ProtocolConfigView
) => {
  if (
    context.state.currentEpochState?.height ===
      epochStatus.epoch_start_height &&
    (context.state.currentEpochState.seatPrice !== undefined ||
      !context.state.genesis)
  ) {
    return context.state.currentEpochState;
  }

  const maxNumberOfSeats =
    networkProtocolConfig.num_block_producer_seats +
    networkProtocolConfig.avg_hidden_validator_seats_per_shard.reduce(
      (sum, seat) => sum + seat,
      0
    );
  context.state.currentEpochState = {
    height: epochStatus.epoch_start_height,
    seatPrice: context.state.genesis
      ? nearApi.validators
          .findSeatPrice(
            epochStatus.current_validators,
            maxNumberOfSeats,
            context.state.genesis.minStakeRatio,
            networkProtocolConfig.protocol_version
          )
          .toString()
      : undefined,
    totalStake: epochStatus.current_validators
      .reduce((acc, node) => acc + BigInt(node.stake), 0n)
      .toString(),
  };
  return context.state.currentEpochState;
};

type EpochData = {
  stats: NetworkStats;
  validators: ValidatorEpochData[];
};

export const queryEpochData = async (context: Context): Promise<EpochData> => {
  const [networkProtocolConfig, epochStatus] = await Promise.all([
    nearApi.sendJsonRpc("EXPERIMENTAL_protocol_config", { finality: "final" }),
    nearApi.sendJsonRpc("validators", [null]),
  ]);
  const epochState = await getEpochState(
    context,
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
    },
    validators: mapValidators(epochStatus, context.state.poolIds),
  };
};
