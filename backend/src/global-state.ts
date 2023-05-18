import { CachedTimestampMap } from "@/backend/cron/types";
import {
  ValidatorDescription,
  ValidatorPoolInfo,
} from "@/backend/router/types";
import { HealthStatus } from "@/backend/types";
import * as RPC from "@/common/types/rpc";

export type GlobalState = {
  stakingPoolsDescriptions: Map<string, ValidatorDescription>;
  stakingPoolStakeProposalsFromContract: CachedTimestampMap<string>;
  stakingPoolInfos: CachedTimestampMap<ValidatorPoolInfo>;
  poolIds: string[];
  genesisConfig: {
    minStakeRatio: [number, number];
    accountCount: number;
  } | null;
  validatorsPromise?: Promise<RPC.EpochValidatorInfo>;
  rpcStatus: HealthStatus;
  indexerStatus: HealthStatus;
};

export const initGlobalState = (): GlobalState => ({
  stakingPoolsDescriptions: new Map(),
  stakingPoolStakeProposalsFromContract: {
    timestampMap: new Map(),
    valueMap: new Map(),
    promisesMap: new Map(),
  },
  stakingPoolInfos: {
    timestampMap: new Map(),
    valueMap: new Map(),
    promisesMap: new Map(),
  },
  poolIds: [],
  genesisConfig: null,
  rpcStatus: { timestamp: Date.now(), ok: true },
  indexerStatus: { timestamp: Date.now(), ok: true },
});
