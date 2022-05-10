export enum DataSource {
  Indexer = "INDEXER_BACKEND",
  Analytics = "ANALYTICS_BACKEND",
  Telemetry = "TELEMETRY_BACKEND",
}

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

// parter list is from the query
// select distinct receiver_account_id
// from transactions
// where receiver_account_id like any (array['%zest%', '%berryclub%', '%paras%', '%bananaswap%', '%tessab%'])
