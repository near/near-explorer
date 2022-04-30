import { NetworkName } from "./client-types";
import { HOUR, MINUTE, SECOND } from "./consts";

const getEnvWithDefault = <T>(
  variableName: string,
  parse: (input: string | undefined) => T | undefined,
  defaultValue: T
): T => {
  const variable = parse(process.env[variableName]);
  return variable === undefined ? defaultValue : variable;
};

const getEnvStringWithDefault = (
  variableName: string,
  defaultValue: string
): string => getEnvWithDefault(variableName, (value) => value, defaultValue);

const getEnvNumberWithDefault = (
  variableName: string,
  defaultValue: number
): number =>
  getEnvWithDefault(
    variableName,
    (v) => {
      const num = parseInt(v || "");
      return isNaN(num) ? undefined : num;
    },
    defaultValue
  );

export const nearArchivalRpcUrl = getEnvStringWithDefault(
  "NEAR_ARCHIVAL_RPC_URL",
  "http://localhost:3030"
);

export const INTERVALS = {
  checkFinalityStatus: getEnvNumberWithDefault(
    "NEAR_REGULAR_PUBLISH_FINALITY_STATUS_INTERVAL",
    SECOND
  ),
  checkChainBlockStats: getEnvNumberWithDefault(
    "NEAR_REGULAR_QUERY_STATS_INTERVAL",
    SECOND
  ),
  checkRecentTransactions: getEnvNumberWithDefault(
    "NEAR_REGULAR_QUERY_STATS_INTERVAL",
    SECOND
  ),
  checkNetworkInfo: getEnvNumberWithDefault(
    "NEAR_REGULAR_PUBLISH_NETWORK_INFO_INTERVAL",
    SECOND
  ),
  checkStakingPoolInfo: getEnvNumberWithDefault(
    "NEAR_REGULAR_FETCH_STAKING_POOLS_INFO_INTERVAL",
    15 * SECOND
  ),
  checkStakingPoolStakeProposal: getEnvNumberWithDefault(
    "NEAR_REGULAR_FETCH_STAKING_POOLS_INFO_INTERVAL",
    15 * SECOND
  ),
  timeoutStakingPoolsInfo: getEnvNumberWithDefault(
    "NEAR_FETCH_STAKING_POOLS_INFO_THROWAWAY_TIMEOUT",
    MINUTE
  ),
  timeoutStakingPoolStakeProposal: getEnvNumberWithDefault(
    "NEAR_FETCH_STAKING_POOLS_INFO_THROWAWAY_TIMEOUT",
    MINUTE
  ),
  checkValidatorDescriptions: getEnvNumberWithDefault(
    "NEAR_REGULAR_FETCH_STAKING_POOLS_METADATA_INFO_INTERVAL",
    10 * MINUTE
  ),
  checkAggregatedStats: getEnvNumberWithDefault(
    "NEAR_REGULAR_STATS_INTERVAL",
    HOUR
  ),
  checkTransactionCountHistory: getEnvNumberWithDefault(
    "NEAR_REGULAR_PUBLISH_TRANSACTION_COUNT_FOR_TWO_WEEKS_INTERVAL",
    10 * MINUTE
  ),
  timeoutFetchValidatorsBailout: getEnvNumberWithDefault(
    "NEAR_REGULAR_PUBLISH_TRANSACTION_COUNT_FOR_TWO_WEEKS_INTERVAL",
    2.5 * SECOND
  ),
  checkPoolIds: getEnvNumberWithDefault(
    "NEAR_REGULAR_POOL_IDS_CHECK_INTERVAL",
    10 * MINUTE
  ),
};

const NETWORK_NAMES: Record<NetworkName, true> = {
  mainnet: true,
  testnet: true,
  guildnet: true,
  localhostnet: true,
};
const isNetworkName = (value: string): value is NetworkName =>
  (Object.keys(NETWORK_NAMES) as NetworkName[]).includes(value as NetworkName);
export const nearNetworkName = getEnvWithDefault(
  "NEAR_EXPLORER_WAMP_NETWORK_NAME",
  (value = "") => (isNetworkName(value) ? value : undefined),
  "localhostnet"
);

const isWampSecure = getEnvWithDefault(
  "NEAR_EXPLORER_WAMP_SECURE",
  (input) => input === "true",
  false
);
const wampHost = getEnvStringWithDefault(
  "NEAR_EXPLORER_WAMP_HOST",
  "localhost"
);
const wampPort = getEnvNumberWithDefault("NEAR_EXPLORER_WAMP_PORT", 10000);
export const wampNearExplorerUrl = `${
  isWampSecure ? "wss" : "ws"
}://${wampHost}:${wampPort}/ws`;

export const wampNearExplorerBackendSecret = getEnvStringWithDefault(
  "NEAR_EXPLORER_WAMP_BACKEND_SECRET",
  "THIS_IS_LOCALHOST_SECRET"
);

export const nearLockupAccountIdSuffix = getEnvStringWithDefault(
  "NEAR_LOCKUP_ACCOUNT_SUFFIX",
  "lockup.near"
);

export const nearStakingPoolAccountSuffix =
  nearNetworkName === "mainnet"
    ? ".poolv1.near"
    : nearNetworkName === "testnet"
    ? ".f863973.m0"
    : getEnvStringWithDefault("NEAR_STAKING_POOL_ACCOUNT_SUFFIX", ".no-suffix");
