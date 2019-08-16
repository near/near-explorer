exports.nearRpcUrl = process.env.NEAR_RPC_URL || "https://rpc.nearprotocol.com";
exports.syncFetchQueueSize = process.env.NEAR_SYNC_FETCH_QUEUE_SIZE || 1000;
exports.syncSaveQueueSize = process.env.NEAR_SYNC_SAVE_QUEUE_SIZE || 10;
exports.bulkDbUpdateSize = process.env.NEAR_SYNC_BULK_DB_UPDATE_SIZE || 10;
exports.regularSyncNewNearcoreStateInterval =
  process.env.NEAR_REGULAR_SYNC_NEW_NEARCORE_STATE_INTERVAL || 1000;
exports.regularSyncMissingNearcoreStateInterval =
  process.env.NEAR_REGULAR_SYNC_MISSING_NEARCORE_STATE_INTERVAL || 60000;

exports.wampNearExplorerUrl =
  process.env.WAMP_NEAR_EXPLORER_URL || "ws://localhost:8080/ws";
exports.wampNearExplorerBackendSecret =
  process.env.WAMP_NEAR_EXPLORER_BACKEND_SECRET || "back";
