exports.nearRpcUrl = process.env.NEAR_RPC_URL || "http://localhost:3030";

exports.debugLogs =
  (process.env.NEAR_DEBUG_LOGS || "TRUE").toUpperCase() !== "FALSE";

exports.syncFetchQueueSize =
  parseInt(process.env.NEAR_SYNC_FETCH_QUEUE_SIZE) || 3;

exports.syncSaveQueueSize =
  parseInt(process.env.NEAR_SYNC_SAVE_QUEUE_SIZE) || 10;

exports.syncNewBlocksHorizon =
  parseInt(process.env.NEAR_SYNC_NEW_BLOCKS_HORIZON) || 100;

exports.bulkDbUpdateSize =
  parseInt(process.env.NEAR_SYNC_BULK_DB_UPDATE_SIZE) || 10;

exports.backupDbOnReset =
  (process.env.NEAR_BACKUP_DB_ON_RESET || "TRUE").toUpperCase() !== "FALSE";

exports.regularCheckGenesisInterval =
  parseInt(process.env.NEAR_REGULAR_CHECK_GENESIS_INTERVAL) || 60000;

exports.regularSyncNewNearcoreStateInterval =
  parseInt(process.env.NEAR_REGULAR_SYNC_NEW_NEARCORE_STATE_INTERVAL) || 5000;

exports.regularSyncMissingNearcoreStateInterval =
  parseInt(process.env.NEAR_REGULAR_SYNC_MISSING_NEARCORE_STATE_INTERVAL) ||
  60000;

exports.regularQueryRPCInterval =
  parseInt(process.env.NEAR_REGULAR_QUERY_RPC_INTERVAL) || 1000;

exports.regularQueryStatsInterval =
  parseInt(process.env.NEAR_REGULAR_QUERY_STATS_INTERVAL) || 1000;

exports.regularCheckNodeStatusInterval =
  parseInt(process.env.NEAR_REGULAR_QUERY_NODE_INTERVAL) || 1000;

exports.wampNearNetworkName =
  process.env.WAMP_NEAR_NETWORK_NAME || "localhostnet";

exports.wampNearExplorerUrl =
  process.env.WAMP_NEAR_EXPLORER_URL || "ws://localhost:8080/ws";

exports.wampNearExplorerBackendSecret =
  process.env.WAMP_NEAR_EXPLORER_BACKEND_SECRET || "back";

exports.genesisRecordsUrl = process.env.NEAR_GENESIS_RECORDS_URL;

let phase2VoteContractName = process.env.NEAR_PHASE2_VOTE_CONTRACT_NAME;
if (!phase2VoteContractName) {
  if (exports.wampNearNetworkName === "mainnet") {
    phase2VoteContractName = "transfer-vote.near";
  } else if (exports.wampNearNetworkName === "testnet") {
    phase2VoteContractName = "vote.f863973.m0";
  }
}
exports.phase2VoteContractName = phase2VoteContractName;

exports.regularCheckPhase2VoteInterval =
  parseInt(process.env.NEAR_REGULAR_CHECK_PHASE2_VOTE_INTERVAL) || 10000;
