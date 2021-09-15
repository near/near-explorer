exports.DS_LEGACY_SYNC_BACKEND = "LEGACY_SYNC_BACKEND";
exports.DS_INDEXER_BACKEND = "INDEXER_BACKEND";
exports.DS_ANALYTICS_BACKEND = "ANALYTICS_BACKEND";
exports.PARTNER_LIST = [
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

// parter list is from the query
// select distinct receiver_account_id
// from transactions
// where receiver_account_id like any (array['%zest%', '%berryclub%', '%paras%', '%bananaswap%', '%tessab%'])
