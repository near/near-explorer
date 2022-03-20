exports.nearArchivalRpcUrl =
  process.env.NEAR_RPC_URL || "http://localhost:3030";

exports.debugLogs =
  (process.env.NEAR_DEBUG_LOGS || "TRUE").toUpperCase() !== "FALSE";

exports.regularPublishFinalityStatusInterval =
  parseInt(process.env.NEAR_REGULAR_PUBLISH_FINALITY_STATUS_INTERVAL) || 1000;

exports.regularQueryStatsInterval =
  parseInt(process.env.NEAR_REGULAR_QUERY_STATS_INTERVAL) || 1000;

exports.regularPublishNetworkInfoInterval =
  parseInt(process.env.NEAR_REGULAR_PUBLISH_NETWORK_INFO_INTERVAL) || 1000;

exports.regularFetchStakingPoolsInfoInterval =
  parseInt(process.env.NEAR_REGULAR_FETCH_STAKING_POOLS_INFO_INTERVAL) || 15000;

exports.regularFetchStakingPoolsMetadataInfoInterval =
  parseInt(
    process.env.NEAR_REGULAR_FETCH_STAKING_POOLS_METADATA_INFO_INTERVAL
  ) || 60000 * 10;

exports.regularStatsInterval =
  parseInt(process.env.NEAR_REGULAR_STATS_INTERVAL) || 3600000;

exports.wampNearNetworkName = process.env.NEAR_NETWORK_NAME || "localhostnet";

const isWampSecure = process.env.NEAR_EXPLORER_WAMP_SECURE === "true";
const wampHost = process.env.NEAR_EXPLORER_WAMP_HOST || "localhost";
const wampPort = process.env.NEAR_EXPLORER_WAMP_PORT || 10000;
exports.wampNearExplorerUrl = `${
  isWampSecure ? "wss" : "ws"
}://${wampHost}:${wampPort}/ws`;

exports.wampNearExplorerBackendSecret =
  process.env.NEAR_EXPLORER_WAMP_BACKEND_SECRET || "THIS_IS_LOCALHOST_SECRET";

exports.nearLockupAccountIdSuffix =
  process.env.NEAR_LOCKUP_ACCOUNT_SUFFIX || "lockup.near";

exports.nearStakingPoolAccountSuffix =
  process.env.NEAR_NETWORK_NAME === "mainnet"
    ? ".poolv1.near"
    : process.env.NEAR_NETWORK_NAME === "testnet"
    ? ".f863973.m0"
    : process.env.NEAR_STAKING_POOL_ACCOUNT_SUFFIX;

exports.regularPublishTransactionCountForTwoWeeksInterval =
  parseInt(
    process.env.NEAR_REGULAR_PUBLISH_TRANSACTION_COUNT_FOR_TWO_WEEKS_INTERVAL
  ) || 60000 * 10;
