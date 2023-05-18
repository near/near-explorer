import { CachedTimestampMap } from "@explorer/backend/cron/types";
import {
  ValidatorDescription,
  ValidatorPoolInfo,
} from "@explorer/backend/router/types";
import { HealthStatus } from "@explorer/backend/types";

export type GlobalState = {
  stakingPoolsDescriptions: Map<string, ValidatorDescription>;
  stakingPoolStakeProposalsFromContract: CachedTimestampMap<string>;
  stakingPoolInfos: CachedTimestampMap<ValidatorPoolInfo>;
  poolIds: string[];
  genesisConfig: {
    minStakeRatio: [number, number];
    accountCount: number;
  } | null;
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
