import { CachedTimestampMap } from "./cron/types";
import { HealthStatus, ValidatorDescription, ValidatorPoolInfo } from "./types";

export type GlobalState = {
  stakingPoolsDescriptions: Map<string, ValidatorDescription>;
  stakingPoolStakeProposalsFromContract: CachedTimestampMap<string>;
  stakingPoolInfos: CachedTimestampMap<ValidatorPoolInfo>;
  poolIds: string[];
  genesis: {
    minStakeRatio: [number, number];
    accountCount: number;
  } | null;
  rpcStatus: HealthStatus;
  indexerStatus: HealthStatus;
  currentEpoch: {
    height: number;
    length: number;
    protocolVersion: number;
  } | null;
  currentValidatorsToDo: {
    totalStake: string;
    seatPrice: string;
  } | null;
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
  currentEpoch: null,
  genesis: null,
  rpcStatus: { timestamp: Date.now(), ok: true },
  indexerStatus: { timestamp: Date.now(), ok: true },
  currentValidatorsToDo: null,
});
