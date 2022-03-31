export const nearArchivalRpcUrl =
  process.env.NEAR_ARCHIVAL_RPC_URL || "http://localhost:3030";

export const debugLogs =
  (process.env.NEAR_DEBUG_LOGS || "TRUE").toUpperCase() !== "FALSE";

export const regularPublishFinalityStatusInterval =
  parseInt(process.env.NEAR_REGULAR_PUBLISH_FINALITY_STATUS_INTERVAL || "") ||
  1000;

export const regularQueryStatsInterval =
  parseInt(process.env.NEAR_REGULAR_QUERY_STATS_INTERVAL || "") || 1000;

export const regularPublishNetworkInfoInterval =
  parseInt(process.env.NEAR_REGULAR_PUBLISH_NETWORK_INFO_INTERVAL || "") ||
  1000;

export const regularFetchStakingPoolsInfoInterval =
  parseInt(process.env.NEAR_REGULAR_FETCH_STAKING_POOLS_INFO_INTERVAL || "") ||
  15000;

export const regularFetchStakingPoolsMetadataInfoInterval =
  parseInt(
    process.env.NEAR_REGULAR_FETCH_STAKING_POOLS_METADATA_INFO_INTERVAL || ""
  ) || 60000 * 10;

export const regularStatsInterval =
  parseInt(process.env.NEAR_REGULAR_STATS_INTERVAL || "") || 3600000;

export const wampNearNetworkName =
  process.env.NEAR_EXPLORER_WAMP_NETWORK_NAME || "localhostnet";

const isWampSecure = process.env.NEAR_EXPLORER_WAMP_SECURE === "true";
const wampHost = process.env.NEAR_EXPLORER_WAMP_HOST || "localhost";
const wampPort = process.env.NEAR_EXPLORER_WAMP_PORT || 10000;
export const wampNearExplorerUrl = `${
  isWampSecure ? "wss" : "ws"
}://${wampHost}:${wampPort}/ws`;

export const wampNearExplorerBackendSecret =
  process.env.NEAR_EXPLORER_WAMP_BACKEND_SECRET || "THIS_IS_LOCALHOST_SECRET";

export const nearLockupAccountIdSuffix =
  process.env.NEAR_LOCKUP_ACCOUNT_SUFFIX || "lockup.near";

export const nearStakingPoolAccountSuffix =
  process.env.NEAR_EXPLORER_WAMP_NETWORK_NAME === "mainnet"
    ? ".poolv1.near"
    : process.env.NEAR_EXPLORER_WAMP_NETWORK_NAME === "testnet"
    ? ".f863973.m0"
    : process.env.NEAR_STAKING_POOL_ACCOUNT_SUFFIX;

export const regularPublishTransactionCountForTwoWeeksInterval =
  parseInt(
    process.env.NEAR_REGULAR_PUBLISH_TRANSACTION_COUNT_FOR_TWO_WEEKS_INTERVAL ||
      ""
  ) || 60000 * 10;
