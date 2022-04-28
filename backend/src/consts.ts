export enum DataSource {
  Indexer = "INDEXER_BACKEND",
  Analytics = "ANALYTICS_BACKEND",
  Telemetry = "TELEMETRY_BACKEND",
}
export const PARTNER_LIST = [
  "cheese.zest.near",
  "miguel.zest.near",
  "zest.near",
  "paras.near",
  "diagnostics.tessab.near",
  "contract.paras.near",
  "plutus.paras.near",
  "berryclub.ek.near",
  "farm.berryclub.ek.near",
  "berryclub.near",
  "cards.berryclub.ek.near",
  "giveaway.paras.near",
  "bananaswap.near",
  "jerry.near.zest",
  "tessab.near",
  "amm.counselor.near",
];

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

// parter list is from the query
// select distinct receiver_account_id
// from transactions
// where receiver_account_id like any (array['%zest%', '%berryclub%', '%paras%', '%bananaswap%', '%tessab%'])
