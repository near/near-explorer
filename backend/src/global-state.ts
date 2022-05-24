import { CachedTimestampMap } from "./check-utils";
import { ValidatorDescription, ValidatorPoolInfo } from "./types";

export type GlobalState = {
  transactionsCountHistoryForTwoWeeks: { date: Date; total: number }[];
  stakingPoolsDescriptions: Map<string, ValidatorDescription>;
  stakingPoolStakeProposalsFromContract: CachedTimestampMap<string>;
  stakingPoolInfos: CachedTimestampMap<ValidatorPoolInfo>;
  poolIds: string[];
};

export const initGlobalState = (): GlobalState => ({
  transactionsCountHistoryForTwoWeeks: [],
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
});
