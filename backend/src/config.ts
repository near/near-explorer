export const nearArchivalRpcUrl =
  process.env.NEAR_ARCHIVAL_RPC_URL ||
  process.env.NEAR_RPC_URL ||
  "http://localhost:3030";

export const debugLogs =
  (process.env.NEAR_DEBUG_LOGS || "TRUE").toUpperCase() !== "FALSE";

export const isIndexerBackendEnabled =
  (process.env.NEAR_IS_INDEXER_BACKEND_ENABLED || "FALSE").toUpperCase() !==
  "FALSE";

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
  process.env.WAMP_NEAR_NETWORK_NAME || "localhostnet";

export const wampNearExplorerUrl =
  process.env.WAMP_NEAR_EXPLORER_URL || "ws://localhost:8080/ws";

export const wampNearExplorerBackendSecret =
  process.env.WAMP_NEAR_EXPLORER_BACKEND_SECRET || "back";

export const nearLockupAccountIdSuffix =
  process.env.NEAR_LOCKUP_ACCOUNT_SUFFIX || "lockup.near";

export const nearStakingPoolAccountSuffix =
  process.env.WAMP_NEAR_NETWORK_NAME === "mainnet"
    ? ".poolv1.near"
    : process.env.WAMP_NEAR_NETWORK_NAME === "testnet"
    ? ".f863973.m0"
    : process.env.NEAR_STAKING_POOL_ACCOUNT_SUFFIX;

export const regularPublishTransactionCountForTwoWeeksInterval =
  parseInt(
    process.env.NEAR_REGULAR_PUBLISH_TRANSACTION_COUNT_FOR_TWO_WEEKS_INTERVAL ||
      ""
  ) || 60000 * 10;
