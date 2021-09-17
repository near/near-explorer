const {
  queryTransactionsCountAggregatedByDate,
  queryGasUsedAggregatedByDate,
  queryNewAccountsCountAggregatedByDate,
  queryDeletedAccountsCountAggregatedByDate,
  queryUniqueDeployedContractsAggregatedByDate,
  queryActiveAccountsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByWeek,
  queryNewContractsCountAggregatedByDate,
  queryActiveContractsCountAggregatedByDate,
  queryActiveContractsList,
  queryActiveAccountsList,
  queryPartnerTotalTransactions,
  queryPartnerFirstThreeMonthTransactions,
  queryDepositAmountAggregatedByDate,
  queryPartnerUniqueUserAmount,
  queryGenesisAccountCount,
  queryLatestCirculatingSupply,
  calculateFeesByDay,
} = require("./db-utils");
const {
  formatDate,
  generateDateArray,
  cumulativeAccountsCountArray,
} = require("./utils");

// term that store data from query
// transaction related
let TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = null;
let GAS_USED_BY_DATE = null;
let DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = null;

// accounts
let NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = [
  {
    date: "2020-07-21 23:59:59",
    accountsCount: "3",
  },
  {
    date: "2020-07-22 23:59:59",
    accountsCount: "3",
  },
  {
    date: "2020-07-23 23:59:59",
    accountsCount: "1",
  },
  {
    date: "2020-07-24 23:59:59",
    accountsCount: "4",
  },
  {
    date: "2020-07-27 23:59:59",
    accountsCount: "6",
  },
  {
    date: "2020-07-28 23:59:59",
    accountsCount: "3",
  },
  {
    date: "2020-07-29 23:59:59",
    accountsCount: "1",
  },
  {
    date: "2020-07-31 23:59:59",
    accountsCount: "5",
  },
  {
    date: "2020-08-05 23:59:59",
    accountsCount: "3",
  },
  {
    date: "2020-08-06 23:59:59",
    accountsCount: "2",
  },
  {
    date: "2020-08-08 23:59:59",
    accountsCount: "2",
  },
  {
    date: "2020-08-09 23:59:59",
    accountsCount: "2",
  },
  {
    date: "2020-08-10 23:59:59",
    accountsCount: "1",
  },
  {
    date: "2020-08-11 23:59:59",
    accountsCount: "6",
  },
  {
    date: "2020-08-12 23:59:59",
    accountsCount: "9",
  },
  {
    date: "2020-08-13 23:59:59",
    accountsCount: "2",
  },
  {
    date: "2020-08-16 23:59:59",
    accountsCount: "1",
  },
  {
    date: "2020-08-18 23:59:59",
    accountsCount: "6",
  },
  {
    date: "2020-08-19 23:59:59",
    accountsCount: "4",
  },
  {
    date: "2020-08-20 23:59:59",
    accountsCount: "3",
  },
  {
    date: "2020-08-21 23:59:59",
    accountsCount: "13",
  },
  {
    date: "2020-08-22 23:59:59",
    accountsCount: "10",
  },
  {
    date: "2020-08-23 23:59:59",
    accountsCount: "4",
  },
  {
    date: "2020-08-24 23:59:59",
    accountsCount: "6",
  },
  {
    date: "2020-08-25 23:59:59",
    accountsCount: "6",
  },
  {
    date: "2020-08-26 23:59:59",
    accountsCount: "10",
  },
  {
    date: "2020-08-27 23:59:59",
    accountsCount: "5",
  },
  {
    date: "2020-08-28 23:59:59",
    accountsCount: "10",
  },
  {
    date: "2020-08-29 23:59:59",
    accountsCount: "8",
  },
  {
    date: "2020-08-30 23:59:59",
    accountsCount: "2",
  },
  {
    date: "2020-08-31 23:59:59",
    accountsCount: "3",
  },
  {
    date: "2020-09-01 23:59:59",
    accountsCount: "22",
  },
  {
    date: "2020-09-02 23:59:59",
    accountsCount: "14",
  },
  {
    date: "2020-09-03 23:59:59",
    accountsCount: "22",
  },
  {
    date: "2020-09-04 23:59:59",
    accountsCount: "69",
  },
  {
    date: "2020-09-05 23:59:59",
    accountsCount: "29",
  },
  {
    date: "2020-09-06 23:59:59",
    accountsCount: "12",
  },
  {
    date: "2020-09-07 23:59:59",
    accountsCount: "24",
  },
  {
    date: "2020-09-08 23:59:59",
    accountsCount: "19",
  },
  {
    date: "2020-09-09 23:59:59",
    accountsCount: "28",
  },
  {
    date: "2020-09-10 23:59:59",
    accountsCount: "302",
  },
  {
    date: "2020-09-11 23:59:59",
    accountsCount: "1408",
  },
  {
    date: "2020-09-12 23:59:59",
    accountsCount: "385",
  },
  {
    date: "2020-09-13 23:59:59",
    accountsCount: "313",
  },
  {
    date: "2020-09-14 23:59:59",
    accountsCount: "423",
  },
  {
    date: "2020-09-15 23:59:59",
    accountsCount: "415",
  },
  {
    date: "2020-09-16 23:59:59",
    accountsCount: "377",
  },
  {
    date: "2020-09-17 23:59:59",
    accountsCount: "147",
  },
  {
    date: "2020-09-18 23:59:59",
    accountsCount: "139",
  },
  {
    date: "2020-09-19 23:59:59",
    accountsCount: "66",
  },
  {
    date: "2020-09-20 23:59:59",
    accountsCount: "50",
  },
  {
    date: "2020-09-21 23:59:59",
    accountsCount: "59",
  },
  {
    date: "2020-09-22 23:59:59",
    accountsCount: "56",
  },
  {
    date: "2020-09-23 23:59:59",
    accountsCount: "96",
  },
  {
    date: "2020-09-24 23:59:59",
    accountsCount: "204",
  },
  {
    date: "2020-09-25 23:59:59",
    accountsCount: "153",
  },
  {
    date: "2020-09-26 23:59:59",
    accountsCount: "67",
  },
  {
    date: "2020-09-27 23:59:59",
    accountsCount: "58",
  },
  {
    date: "2020-09-28 23:59:59",
    accountsCount: "104",
  },
  {
    date: "2020-09-29 23:59:59",
    accountsCount: "143",
  },
  {
    date: "2020-09-30 23:59:59",
    accountsCount: "257",
  },
  {
    date: "2020-10-01 23:59:59",
    accountsCount: "203",
  },
  {
    date: "2020-10-02 23:59:59",
    accountsCount: "566",
  },
  {
    date: "2020-10-03 23:59:59",
    accountsCount: "416",
  },
  {
    date: "2020-10-04 23:59:59",
    accountsCount: "240",
  },
  {
    date: "2020-10-05 23:59:59",
    accountsCount: "203",
  },
  {
    date: "2020-10-06 23:59:59",
    accountsCount: "132",
  },
  {
    date: "2020-10-07 23:59:59",
    accountsCount: "123",
  },
  {
    date: "2020-10-08 23:59:59",
    accountsCount: "134",
  },
  {
    date: "2020-10-09 23:59:59",
    accountsCount: "214",
  },
  {
    date: "2020-10-10 23:59:59",
    accountsCount: "81",
  },
  {
    date: "2020-10-11 23:59:59",
    accountsCount: "75",
  },
  {
    date: "2020-10-12 23:59:59",
    accountsCount: "208",
  },
  {
    date: "2020-10-13 23:59:59",
    accountsCount: "567",
  },
  {
    date: "2020-10-14 23:59:59",
    accountsCount: "2902",
  },
  {
    date: "2020-10-15 23:59:59",
    accountsCount: "624",
  },
  {
    date: "2020-10-16 23:59:59",
    accountsCount: "450",
  },
  {
    date: "2020-10-17 23:59:59",
    accountsCount: "280",
  },
  {
    date: "2020-10-18 23:59:59",
    accountsCount: "241",
  },
  {
    date: "2020-10-19 23:59:59",
    accountsCount: "302",
  },
  {
    date: "2020-10-20 23:59:59",
    accountsCount: "412",
  },
  {
    date: "2020-10-21 23:59:59",
    accountsCount: "555",
  },
  {
    date: "2020-10-22 23:59:59",
    accountsCount: "465",
  },
  {
    date: "220-10-23 23:59:59",
    accountsCount: "343",
  },
  {
    date: "2020-10-24 23:59:59",
    accountsCount: "278",
  },
  {
    date: "2020-10-25 23:59:59",
    accountsCount: "328",
  },
  {
    date: "2020-10-26 23:59:59",
    accountsCount: "283",
  },
  {
    date: "2020-10-27 23:59:59",
    accountsCount: "338",
  },
  {
    date: "2020-10-28 23:59:59",
    accountsCount: "1077",
  },
  {
    date: "2020-10-29 23:59:59",
    accountsCount: "687",
  },
  {
    date: "2020-10-30 23:59:59",
    accountsCount: "467",
  },
  {
    date: "2020-10-31 23:59:59",
    accountsCount: "411",
  },
  {
    date: "2020-11-01 23:59:59",
    accountsCount: "438",
  },
  {
    date: "2020-11-02 23:59:59",
    accountsCount: "393",
  },
  {
    date: "2020-11-03 23:59:59",
    accountsCount: "450",
  },
  {
    date: "2020-11-04 23:59:59",
    accountsCount: "337",
  },
  {
    date: "2020-11-05 23:59:59",
    accountsCount: "657",
  },
  {
    date: "2020-11-06 23:59:59",
    accountsCount: "440",
  },
  {
    date: "2020-11-07 23:59:59",
    accountsCount: "475",
  },
  {
    date: "2020-11-08 23:59:59",
    accountsCount: "602",
  },
  {
    date: "2020-11-09 23:59:59",
    accountsCount: "592",
  },
  {
    date: "2020-11-10 23:59:59",
    accountsCount: "685",
  },
  {
    date: "2020-11-11 23:59:59",
    accountsCount: "475",
  },
  {
    date: "2020-11-12 23:59:59",
    accountsCount: "464",
  },
  {
    date: "2020-11-13 23:59:59",
    accountsCount: "367",
  },
  {
    date: "2020-11-14 23:59:59",
    accountsCount: "359",
  },
  {
    date: "2020-11-15 23:59:59",
    accountsCount: "284",
  },
  {
    date: "2020-11-16 23:59:59",
    accountsCount: "330",
  },
  {
    date: "2020-11-17 23:59:59",
    accountsCount: "427",
  },
  {
    date: "2020-11-18 23:59:59",
    accountsCount: "269",
  },
  {
    date: "2020-11-19 23:59:59",
    accountsCount: "271",
  },
  {
    date: "2020-11-20 23:59:59",
    accountsCount: "479",
  },
  {
    date: "2020-11-21 23:59:59",
    accountsCount: "727",
  },
  {
    date: "2020-11-22 23:59:59",
    accountsCount: "526",
  },
  {
    date: "2020-11-23 23:59:59",
    accountsCount: "681",
  },
  {
    date: "2020-11-24 23:59:59",
    accountsCount: "776",
  },
  {
    date: "2020-11-25 23:59:59",
    accountsCount: "460",
  },
  {
    date: "2020-11-26 23:59:59",
    accountsCount: "391",
  },
  {
    date: "2020-11-27 23:59:59",
    accountsCount: "443",
  },
  {
    date: "2020-11-28 23:59:59",
    accountsCount: "398",
  },
  {
    date: "2020-11-29 23:59:59",
    accountsCount: "328",
  },
  {
    date: "2020-11-30 23:59:59",
    accountsCount: "485",
  },
  {
    date: "2020-12-01 23:59:59",
    accountsCount: "580",
  },
  {
    date: "2020-12-02 23:59:59",
    accountsCount: "626",
  },
  {
    date: "2020-12-03 23:59:59",
    accountsCount: "535",
  },
  {
    date: "2020-12-04 23:59:59",
    accountsCount: "607",
  },
  {
    date: "2020-12-05 23:59:59",
    accountsCount: "444",
  },
  {
    date: "2020-12-06 23:59:59",
    accountsCount: "494",
  },
  {
    date: "2020-12-07 23:59:59",
    accountsCount: "465",
  },
  {
    date: "2020-12-08 23:59:59",
    accountsCount: "436",
  },
  {
    date: "2020-12-09 23:59:59",
    accountsCount: "400",
  },
  {
    date: "2020-12-10 23:59:59",
    accountsCount: "362",
  },
  {
    date: "2020-12-11 23:59:59",
    accountsCount: "380",
  },
  {
    date: "2020-12-12 23:59:59",
    accountsCount: "309",
  },
  {
    date: "2020-12-13 23:59:59",
    accountsCount: "366",
  },
  {
    date: "2020-12-14 23:59:59",
    accountsCount: "434",
  },
  {
    date: "2020-12-15 23:59:59",
    accountsCount: "660",
  },
  {
    date: "2020-12-16 23:59:59",
    accountsCount: "534",
  },
  {
    date: "2020-12-17 23:59:59",
    accountsCount: "422",
  },
  {
    date: "2020-12-18 23:59:59",
    accountsCount: "381",
  },
  {
    date: "2020-12-19 23:59:59",
    accountsCount: "351",
  },
  {
    date: "2020-12-20 23:59:59",
    accountsCount: "390",
  },
  {
    date: "2020-12-21 23:59:59",
    accountsCount: "722",
  },
  {
    date: "2020-12-22 23:59:59",
    accountsCount: "609",
  },
  {
    date: "2020-12-23 23:59:59",
    accountsCount: "680",
  },
  {
    date: "2020-12-24 23:59:59",
    accountsCount: "446",
  },
  {
    date: "2020-12-25 23:59:59",
    accountsCount: "339",
  },
  {
    date: "2020-12-26 23:59:59",
    accountsCount: "481",
  },
  {
    date: "2020-12-27 23:59:59",
    accountsCount: "463",
  },
  {
    date: "2020-12-28 23:59:59",
    accountsCount: "534",
  },
  {
    date: "2020-12-29 23:59:59",
    accountsCount: "387",
  },
  {
    date: "2020-12-30 23:59:59",
    accountsCount: "441",
  },
  {
    date: "2020-12-31 23:59:59",
    accountsCount: "427",
  },
  {
    date: "2021-01-01 23:59:59",
    accountsCount: "461",
  },
  {
    date: "2021-01-02 23:59:59",
    accountsCount: "387",
  },
  {
    date: "2021-01-03 23:59:59",
    accountsCount: "507",
  },
  {
    date: "2021-01-04 23:59:59",
    accountsCount: "495",
  },
  {
    date: "2021-01-05 23:59:59",
    accountsCount: "525",
  },
  {
    date: "2021-01-06 23:59:59",
    accountsCount: "493",
  },
  {
    date: "2021-01-07 23:59:59",
    accountsCount: "467",
  },
  {
    date: "2021-01-08 23:59:59",
    accountsCount: "2166",
  },
  {
    date: "2021-01-09 23:59:59",
    accountsCount: "572",
  },
  {
    date: "2021-01-10 23:59:59",
    accountsCount: "614",
  },
  {
    date: "2021-01-11 23:59:59",
    accountsCount: "540",
  },
  {
    date: "2021-01-12 23:59:59",
    accountsCount: "522",
  },
  {
    date: "2021-01-13 23:59:59",
    accountsCount: "728",
  },
  {
    date: "2021-01-14 23:59:59",
    accountsCount: "824",
  },
  {
    date: "2021-01-15 23:59:59",
    accountsCount: "916",
  },
  {
    date: "2021-01-16 23:59:59",
    accountsCount: "1067",
  },
  {
    date: "2021-01-17 23:59:59",
    accountsCount: "1375",
  },
  {
    date: "2021-01-18 23:59:59",
    accountsCount: "1181",
  },
  {
    date: "2021-01-19 23:59:59",
    accountsCount: "1092",
  },
  {
    date: "2021-01-20 23:59:59",
    accountsCount: "958",
  },
  {
    date: "2021-01-21 23:59:59",
    accountsCount: "925",
  },
  {
    date: "2021-01-22 23:59:59",
    accountsCount: "821",
  },
  {
    date: "2021-01-23 23:59:59",
    accountsCount: "819",
  },
  {
    date: "2021-01-24 23:59:59",
    accountsCount: "990",
  },
  {
    date: "2021-01-25 23:59:59",
    accountsCount: "917",
  },
  {
    date: "2021-01-26 23:59:59",
    accountsCount: "514",
  },
  {
    date: "2021-01-27 23:59:59",
    accountsCount: "868",
  },
  {
    date: "2021-01-28 23:59:59",
    accountsCount: "934",
  },
  {
    date: "2021-01-29 23:59:59",
    accountsCount: "718",
  },
  {
    date: "2021-01-30 23:59:59",
    accountsCount: "515",
  },
  {
    date: "2021-01-31 23:59:59",
    accountsCount: "493",
  },
  {
    date: "2021-02-01 23:59:59",
    accountsCount: "713",
  },
  {
    date: "2021-02-02 23:59:59",
    accountsCount: "666",
  },
  {
    date: "2021-02-03 23:59:59",
    accountsCount: "878",
  },
  {
    date: "2021-02-04 23:59:59",
    accountsCount: "960",
  },
  {
    date: "2021-02-05 23:59:59",
    accountsCount: "1192",
  },
  {
    date: "2021-02-06 23:59:59",
    accountsCount: "930",
  },
  {
    date: "2021-02-07 23:59:59",
    accountsCount: "1299",
  },
  {
    date: "2021-02-08 23:59:59",
    accountsCount: "1424",
  },
  {
    date: "2021-02-09 23:59:59",
    accountsCount: "1124",
  },
  {
    date: "2021-02-10 23:59:59",
    accountsCount: "1252",
  },
  {
    date: "2021-02-11 23:59:59",
    accountsCount: "958",
  },
  {
    date: "2021-02-12 23:59:59",
    accountsCount: "1527",
  },
  {
    date: "2021-02-13 23:59:59",
    accountsCount: "1372",
  },
  {
    date: "2021-02-14 23:59:59",
    accountsCount: "1057",
  },
  {
    date: "2021-02-15 23:59:59",
    accountsCount: "1150",
  },
  {
    date: "2021-02-16 23:59:59",
    accountsCount: "1141",
  },
  {
    date: "2021-02-17 23:59:59",
    accountsCount: "1018",
  },
  {
    date: "2021-02-18 23:59:59",
    accountsCount: "1120",
  },
  {
    date: "2021-02-19 23:59:59",
    accountsCount: "1086",
  },
  {
    date: "2021-02-20 23:59:59",
    accountsCount: "1005",
  },
  {
    date: "2021-02-21 23:59:59",
    accountsCount: "981",
  },
  {
    date: "2021-02-22 23:59:59",
    accountsCount: "1083",
  },
  {
    date: "2021-02-23 23:59:59",
    accountsCount: "906",
  },
  {
    date: "2021-02-24 23:59:59",
    accountsCount: "1062",
  },
  {
    date: "2021-02-25 23:59:59",
    accountsCount: "1089",
  },
  {
    date: "2021-02-26 23:59:59",
    accountsCount: "1226",
  },
  {
    date: "2021-02-27 23:59:59",
    accountsCount: "953",
  },
  {
    date: "2021-02-28 23:59:59",
    accountsCount: "962",
  },
  {
    date: "2021-03-01 23:59:59",
    accountsCount: "1163",
  },
  {
    date: "2021-03-02 23:59:59",
    accountsCount: "1060",
  },
  {
    date: "2021-03-03 23:59:59",
    accountsCount: "1194",
  },
  {
    date: "2021-03-04 23:59:59",
    accountsCount: "1212",
  },
  {
    date: "2021-03-05 23:59:59",
    accountsCount: "2394",
  },
  {
    date: "2021-03-06 23:59:59",
    accountsCount: "1855",
  },
  {
    date: "2021-03-07 23:59:59",
    accountsCount: "953",
  },
  {
    date: "2021-03-08 23:59:59",
    accountsCount: "924",
  },
  {
    date: "2021-03-09 23:59:59",
    accountsCount: "1357",
  },
  {
    date: "2021-03-10 23:59:59",
    accountsCount: "2033",
  },
  {
    date: "2021-03-11 23:59:59",
    accountsCount: "1640",
  },
  {
    date: "2021-03-12 23:59:59",
    accountsCount: "1860",
  },
  {
    date: "2021-03-13 23:59:59",
    accountsCount: "2271",
  },
  {
    date: "2021-03-14 23:59:59",
    accountsCount: "1515",
  },
  {
    date: "2021-03-15 23:59:59",
    accountsCount: "1173",
  },
  {
    date: "2021-03-16 23:59:59",
    accountsCount: "1171",
  },
  {
    date: "2021-03-17 23:59:59",
    accountsCount: "950",
  },
  {
    date: "2021-03-18 23:59:59",
    accountsCount: "1044",
  },
  {
    date: "2021-03-19 23:59:59",
    accountsCount: "965",
  },
  {
    date: "2021-03-20 23:59:59",
    accountsCount: "955",
  },
  {
    date: "2021-03-21 23:59:59",
    accountsCount: "988",
  },
  {
    date: "2021-03-22 23:59:59",
    accountsCount: "1048",
  },
  {
    date: "2021-03-23 23:59:59",
    accountsCount: "909",
  },
  {
    date: "2021-03-24 23:59:59",
    accountsCount: "1110",
  },
  {
    date: "2021-03-25 23:59:59",
    accountsCount: "802",
  },
  {
    date: "2021-03-26 23:59:59",
    accountsCount: "847",
  },
  {
    date: "2021-03-27 23:59:59",
    accountsCount: "672",
  },
  {
    date: "2021-03-28 23:59:59",
    accountsCount: "727",
  },
  {
    date: "2021-03-29 23:59:59",
    accountsCount: "923",
  },
  {
    date: "2021-03-30 23:59:59",
    accountsCount: "951",
  },
  {
    date: "2021-03-31 23:59:59",
    accountsCount: "907",
  },
  {
    date: "2021-04-01 23:59:59",
    accountsCount: "936",
  },
  {
    date: "2021-04-02 23:59:59",
    accountsCount: "902",
  },
  {
    date: "2021-04-03 23:59:59",
    accountsCount: "744",
  },
  {
    date: "2021-04-04 23:59:59",
    accountsCount: "676",
  },
  {
    date: "2021-04-05 23:59:59",
    accountsCount: "873",
  },
  {
    date: "2021-04-06 23:59:59",
    accountsCount: "1649",
  },
  {
    date: "2021-04-07 23:59:59",
    accountsCount: "2146",
  },
  {
    date: "2021-04-08 23:59:59",
    accountsCount: "1576",
  },
  {
    date: "2021-04-09 23:59:59",
    accountsCount: "5324",
  },
  {
    date: "2021-04-10 23:59:59",
    accountsCount: "2912",
  },
  {
    date: "2021-04-11 23:59:59",
    accountsCount: "3014",
  },
  {
    date: "2021-04-12 23:59:59",
    accountsCount: "6281",
  },
  {
    date: "2021-04-13 23:59:59",
    accountsCount: "8490",
  },
  {
    date: "2021-04-14 23:59:59",
    accountsCount: "7713",
  },
  {
    date: "2021-04-15 23:59:59",
    accountsCount: "5237",
  },
  {
    date: "2021-04-16 23:59:59",
    accountsCount: "3476",
  },
  {
    date: "2021-04-17 23:59:59",
    accountsCount: "3117",
  },
  {
    date: "2021-04-18 23:59:59",
    accountsCount: "1867",
  },
  {
    date: "2021-04-19 23:59:59",
    accountsCount: "2678",
  },
  {
    date: "2021-04-20 23:59:59",
    accountsCount: "2930",
  },
  {
    date: "2021-04-21 23:59:59",
    accountsCount: "2275",
  },
  {
    date: "2021-04-22 23:59:59",
    accountsCount: "4655",
  },
  {
    date: "2021-04-23 23:59:59",
    accountsCount: "5135",
  },
  {
    date: "2021-04-24 23:59:59",
    accountsCount: "2641",
  },
  {
    date: "2021-04-25 23:59:59",
    accountsCount: "3575",
  },
  {
    date: "2021-04-26 23:59:59",
    accountsCount: "7016",
  },
  {
    date: "2021-04-27 23:59:59",
    accountsCount: "9876",
  },
  {
    date: "2021-04-28 23:59:59",
    accountsCount: "10190",
  },
  {
    date: "2021-04-29 23:59:59",
    accountsCount: "9523",
  },
  {
    date: "2021-04-30 23:59:59",
    accountsCount: "5368",
  },
  {
    date: "2021-05-01 23:59:59",
    accountsCount: "4375",
  },
  {
    date: "2021-05-02 23:59:59",
    accountsCount: "2989",
  },
  {
    date: "2021-05-03 23:59:59",
    accountsCount: "3082",
  },
  {
    date: "2021-05-04 23:59:59",
    accountsCount: "2903",
  },
  {
    date: "2021-05-05 23:59:59",
    accountsCount: "3166",
  },
  {
    date: "2021-05-06 23:59:59",
    accountsCount: "3223",
  },
  {
    date: "2021-05-07 23:59:59",
    accountsCount: "2645",
  },
  {
    date: "2021-05-08 23:59:59",
    accountsCount: "2798",
  },
  {
    date: "2021-05-09 23:59:59",
    accountsCount: "2580",
  },
  {
    date: "2021-05-10 23:59:59",
    accountsCount: "2490",
  },
  {
    date: "2021-05-11 23:59:59",
    accountsCount: "2441",
  },
  {
    date: "2021-05-12 23:59:59",
    accountsCount: "2662",
  },
  {
    date: "2021-05-13 23:59:59",
    accountsCount: "2262",
  },
  {
    date: "2021-05-14 23:59:59",
    accountsCount: "4362",
  },
  {
    date: "2021-05-15 23:59:59",
    accountsCount: "5336",
  },
  {
    date: "2021-05-16 23:59:59",
    accountsCount: "3383",
  },
  {
    date: "2021-05-17 23:59:59",
    accountsCount: "5442",
  },
  {
    date: "2021-05-18 23:59:59",
    accountsCount: "5710",
  },
  {
    date: "2021-05-19 23:59:59",
    accountsCount: "10335",
  },
  {
    date: "2021-05-20 23:59:59",
    accountsCount: "4508",
  },
  {
    date: "2021-05-21 23:59:59",
    accountsCount: "6047",
  },
  {
    date: "2021-05-22 23:59:59",
    accountsCount: "4119",
  },
  {
    date: "2021-05-23 23:59:59",
    accountsCount: "3129",
  },
  {
    date: "2021-05-24 23:59:59",
    accountsCount: "2657",
  },
  {
    date: "2021-05-25 23:59:59",
    accountsCount: "2447",
  },
  {
    date: "2021-05-26 23:59:59",
    accountsCount: "6033",
  },
  {
    date: "2021-05-27 23:59:59",
    accountsCount: "3245",
  },
  {
    date: "2021-05-28 23:59:59",
    accountsCount: "2807",
  },
  {
    date: "2021-05-29 23:59:59",
    accountsCount: "3245",
  },
  {
    date: "2021-05-30 23:59:59",
    accountsCount: "3321",
  },
  {
    date: "2021-05-31 23:59:59",
    accountsCount: "6377",
  },
  {
    date: "2021-06-01 23:59:59",
    accountsCount: "4334",
  },
  {
    date: "2021-06-02 23:59:59",
    accountsCount: "4531",
  },
  {
    date: "2021-06-03 23:59:59",
    accountsCount: "5316",
  },
  {
    date: "2021-06-04 23:59:59",
    accountsCount: "7945",
  },
  {
    date: "2021-06-05 23:59:59",
    accountsCount: "17601",
  },
  {
    date: "2021-06-06 23:59:59",
    accountsCount: "8721",
  },
  {
    date: "2021-06-07 23:59:59",
    accountsCount: "6148",
  },
  {
    date: "2021-06-08 23:59:59",
    accountsCount: "4896",
  },
  {
    date: "2021-06-09 23:59:59",
    accountsCount: "9438",
  },
  {
    date: "2021-06-10 23:59:59",
    accountsCount: "8740",
  },
  {
    date: "2021-06-11 23:59:59",
    accountsCount: "5640",
  },
  {
    date: "2021-06-12 23:59:59",
    accountsCount: "4772",
  },
  {
    date: "2021-06-13 23:59:59",
    accountsCount: "4147",
  },
  {
    date: "2021-06-14 23:59:59",
    accountsCount: "4081",
  },
  {
    date: "2021-06-15 23:59:59",
    accountsCount: "4633",
  },
  {
    date: "2021-06-16 23:59:59",
    accountsCount: "6427",
  },
  {
    date: "2021-06-17 23:59:59",
    accountsCount: "9879",
  },
  {
    date: "2021-06-18 23:59:59",
    accountsCount: "14606",
  },
  {
    date: "2021-06-19 23:59:59",
    accountsCount: "12277",
  },
  {
    date: "2021-06-20 23:59:59",
    accountsCount: "17271",
  },
  {
    date: "2021-06-21 23:59:59",
    accountsCount: "12973",
  },
  {
    date: "2021-06-22 23:59:59",
    accountsCount: "4201",
  },
  {
    date: "2021-06-23 23:59:59",
    accountsCount: "3900",
  },
  {
    date: "2021-06-24 23:59:59",
    accountsCount: "4904",
  },
  {
    date: "2021-06-25 23:59:59",
    accountsCount: "3819",
  },
  {
    date: "2021-06-26 23:59:59",
    accountsCount: "3287",
  },
  {
    date: "2021-06-27 23:59:59",
    accountsCount: "3559",
  },
  {
    date: "2021-06-28 23:59:59",
    accountsCount: "3740",
  },
  {
    date: "2021-06-29 23:59:59",
    accountsCount: "4085",
  },
  {
    date: "2021-06-30 23:59:59",
    accountsCount: "4067",
  },
  {
    date: "2021-07-01 23:59:59",
    accountsCount: "4248",
  },
  {
    date: "2021-07-02 23:59:59",
    accountsCount: "4226",
  },
  {
    date: "2021-07-03 23:59:59",
    accountsCount: "3738",
  },
  {
    date: "2021-07-04 23:59:59",
    accountsCount: "4110",
  },
  {
    date: "2021-07-05 23:59:59",
    accountsCount: "4484",
  },
  {
    date: "2021-07-06 23:59:59",
    accountsCount: "4654",
  },
  {
    date: "2021-07-07 23:59:59",
    accountsCount: "4620",
  },
  {
    date: "2021-07-08 23:59:59",
    accountsCount: "5112",
  },
  {
    date: "2021-07-09 23:59:59",
    accountsCount: "3653",
  },
  {
    date: "2021-07-10 23:59:59",
    accountsCount: "4946",
  },
  {
    date: "2021-07-11 23:59:59",
    accountsCount: "3660",
  },
  {
    date: "2021-07-12 23:59:59",
    accountsCount: "3576",
  },
  {
    date: "2021-07-13 23:59:59",
    accountsCount: "4557",
  },
  {
    date: "2021-07-14 23:59:59",
    accountsCount: "8583",
  },
  {
    date: "2021-07-15 23:59:59",
    accountsCount: "4914",
  },
  {
    date: "2021-07-16 23:59:59",
    accountsCount: "4831",
  },
  {
    date: "2021-07-17 23:59:59",
    accountsCount: "5756",
  },
  {
    date: "2021-07-18 23:59:59",
    accountsCount: "4267",
  },
  {
    date: "2021-07-19 23:59:59",
    accountsCount: "4350",
  },
  {
    date: "2021-07-20 23:59:59",
    accountsCount: "3901",
  },
  {
    date: "2021-07-21 23:59:59",
    accountsCount: "4359",
  },
  {
    date: "2021-07-22 23:59:59",
    accountsCount: "6269",
  },
  {
    date: "2021-07-23 23:59:59",
    accountsCount: "5877",
  },
  {
    date: "2021-07-24 23:59:59",
    accountsCount: "5647",
  },
  {
    date: "2021-07-25 23:59:59",
    accountsCount: "5718",
  },
  {
    date: "2021-07-26 23:59:59",
    accountsCount: "7403",
  },
  {
    date: "2021-07-27 23:59:59",
    accountsCount: "6745",
  },
  {
    date: "2021-07-28 23:59:59",
    accountsCount: "7616",
  },
  {
    date: "2021-07-29 23:59:59",
    accountsCount: "8044",
  },
  {
    date: "2021-07-30 23:59:59",
    accountsCount: "8860",
  },
  {
    date: "2021-07-31 23:59:59",
    accountsCount: "9481",
  },
  {
    date: "2021-08-01 23:59:59",
    accountsCount: "8402",
  },
  {
    date: "2021-08-02 23:59:59",
    accountsCount: "8786",
  },
  {
    date: "2021-08-03 23:59:59",
    accountsCount: "8301",
  },
  {
    date: "2021-08-04 23:59:59",
    accountsCount: "8616",
  },
  {
    date: "2021-08-05 23:59:59",
    accountsCount: "9289",
  },
  {
    date: "2021-08-06 23:59:59",
    accountsCount: "9976",
  },
  {
    date: "2021-08-07 23:59:59",
    accountsCount: "12417",
  },
  {
    date: "2021-08-08 23:59:59",
    accountsCount: "13657",
  },
  {
    date: "2021-08-09 23:59:59",
    accountsCount: "11203",
  },
  {
    date: "2021-08-10 23:59:59",
    accountsCount: "13959",
  },
  {
    date: "2021-08-11 23:59:59",
    accountsCount: "15165",
  },
  {
    date: "2021-08-12 23:59:59",
    accountsCount: "19699",
  },
  {
    date: "2021-08-13 23:59:59",
    accountsCount: "13643",
  },
  {
    date: "2021-08-14 23:59:59",
    accountsCount: "6902",
  },
  {
    date: "2021-08-15 23:59:59",
    accountsCount: "4186",
  },
  {
    date: "2021-08-16 23:59:59",
    accountsCount: "4361",
  },
  {
    date: "2021-08-17 23:59:59",
    accountsCount: "5452",
  },
  {
    date: "2021-08-18 23:59:59",
    accountsCount: "8558",
  },
  {
    date: "2021-08-19 23:59:59",
    accountsCount: "5863",
  },
  {
    date: "2021-08-20 23:59:59",
    accountsCount: "6194",
  },
  {
    date: "2021-08-21 23:59:59",
    accountsCount: "7181",
  },
  {
    date: "2021-08-22 23:59:59",
    accountsCount: "8939",
  },
  {
    date: "2021-08-23 23:59:59",
    accountsCount: "8196",
  },
  {
    date: "2021-08-24 23:59:59",
    accountsCount: "7069",
  },
  {
    date: "2021-08-25 23:59:59",
    accountsCount: "7354",
  },
  {
    date: "2021-08-26 23:59:59",
    accountsCount: "7792",
  },
  {
    date: "2021-08-27 23:59:59",
    accountsCount: "22235",
  },
  {
    date: "2021-08-28 23:59:59",
    accountsCount: "21149",
  },
  {
    date: "2021-08-29 23:59:59",
    accountsCount: "24414",
  },
  {
    date: "2021-08-30 23:59:59",
    accountsCount: "22508",
  },
  {
    date: "2021-08-31 23:59:59",
    accountsCount: "25044",
  },
  {
    date: "2021-09-01 23:59:59",
    accountsCount: "30320",
  },
  {
    date: "2021-09-02 23:59:59",
    accountsCount: "20503",
  },
  {
    date: "2021-09-03 23:59:59",
    accountsCount: "25517",
  },
  {
    date: "2021-09-04 23:59:59",
    accountsCount: "33048",
  },
  {
    date: "2021-09-05 23:59:59",
    accountsCount: "32047",
  },
  {
    date: "2021-09-06 23:59:59",
    accountsCount: "34266",
  },
  {
    date: "2021-09-07 23:59:59",
    accountsCount: "28668",
  },
  {
    date: "2021-09-08 23:59:59",
    accountsCount: "40101",
  },
  {
    date: "2021-09-09 23:59:59",
    accountsCount: "32738",
  },
  {
    date: "2021-09-10 23:59:59",
    accountsCount: "32114",
  },
  {
    date: "2021-09-11 23:59:59",
    accountsCount: "24429",
  },
  {
    date: "2021-09-12 23:59:59",
    accountsCount: "24603",
  },
  {
    date: "2021-09-13 23:59:59",
    accountsCount: "18010",
  },
  {
    date: "2021-09-14 23:59:59",
    accountsCount: "47618",
  },
  {
    date: "2021-09-15 23:59:59",
    accountsCount: "52974",
  },
  {
    date: "2021-09-16 23:59:59",
    accountsCount: "35736",
  },
];
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = [
  {
    date: "2020-07-20 23:59:59",
    accountsCount: "8",
  },
  {
    date: "2020-07-27 23:59:59",
    accountsCount: "11",
  },
  {
    date: "2020-08-03 23:59:59",
    accountsCount: "7",
  },
  {
    date: "2020-08-10 23:59:59",
    accountsCount: "12",
  },
  {
    date: "2020-08-17 23:59:59",
    accountsCount: "23",
  },
  {
    date: "2020-08-24 23:59:59",
    accountsCount: "26",
  },
  {
    date: "2020-08-31 23:59:59",
    accountsCount: "123",
  },
  {
    date: "2020-09-07 23:59:59",
    accountsCount: "2254",
  },
  {
    date: "2020-09-14 23:59:59",
    accountsCount: "1420",
  },
  {
    date: "2020-09-21 23:59:59",
    accountsCount: "594",
  },
  {
    date: "2020-09-28 23:59:59",
    accountsCount: "1451",
  },
  {
    date: "2020-10-05 23:59:59",
    accountsCount: "753",
  },
  {
    date: "2020-10-12 23:59:59",
    accountsCount: "4158",
  },
  {
    date: "2020-10-19 23:59:59",
    accountsCount: "1803",
  },
  {
    date: "2020-10-26 23:59:59",
    accountsCount: "2906",
  },
  {
    date: "2020-11-02 23:59:59",
    accountsCount: "2436",
  },
  {
    date: "2020-11-09 23:59:59",
    accountsCount: "2112",
  },
  {
    date: "2020-11-16 23:59:59",
    accountsCount: "2098",
  },
  {
    date: "2020-11-23 23:59:59",
    accountsCount: "2332",
  },
  {
    date: "2020-11-30 23:59:59",
    accountsCount: "2587",
  },
  {
    date: "2020-12-07 23:59:59",
    accountsCount: "1632",
  },
  {
    date: "2020-12-14 23:59:59",
    accountsCount: "1921",
  },
  {
    date: "2020-12-21 23:59:59",
    accountsCount: "2500",
  },
  {
    date: "2020-12-28 23:59:59",
    accountsCount: "2026",
  },
  {
    date: "2021-01-04 23:59:59",
    accountsCount: "3886",
  },
  {
    date: "2021-01-11 23:59:59",
    accountsCount: "4479",
  },
  {
    date: "2021-01-18 23:59:59",
    accountsCount: "5184",
  },
  {
    date: "2021-01-25 23:59:59",
    accountsCount: "3475",
  },
  {
    date: "2021-02-01 23:59:59",
    accountsCount: "4836",
  },
  {
    date: "2021-02-08 23:59:59",
    accountsCount: "6490",
  },
  {
    date: "2021-02-15 23:59:59",
    accountsCount: "5563",
  },
  {
    date: "2021-02-22 23:59:59",
    accountsCount: "5394",
  },
  {
    date: "2021-03-01 23:59:59",
    accountsCount: "7604",
  },
  {
    date: "2021-03-08 23:59:59",
    accountsCount: "8397",
  },
  {
    date: "2021-03-15 23:59:59",
    accountsCount: "4833",
  },
  {
    date: "2021-03-22 23:59:59",
    accountsCount: "3953",
  },
  {
    date: "2021-03-29 23:59:59",
    accountsCount: "3943",
  },
  {
    date: "2021-04-05 23:59:59",
    accountsCount: "13239",
  },
  {
    date: "2021-04-12 23:59:59",
    accountsCount: "30436",
  },
  {
    date: "2021-04-19 23:59:59",
    accountsCount: "19496",
  },
  {
    date: "2021-04-26 23:59:59",
    accountsCount: "42625",
  },
  {
    date: "2021-05-03 23:59:59",
    accountsCount: "15674",
  },
  {
    date: "2021-05-10 23:59:59",
    accountsCount: "16951",
  },
  {
    date: "2021-05-17 23:59:59",
    accountsCount: "30752",
  },
  {
    date: "2021-05-24 23:59:59",
    accountsCount: "17110",
  },
  {
    date: "2021-05-31 23:59:59",
    accountsCount: "46352",
  },
  {
    date: "2021-06-07 23:59:59",
    accountsCount: "34857",
  },
  {
    date: "2021-06-14 23:59:59",
    accountsCount: "56103",
  },
  {
    date: "2021-06-21 23:59:59",
    accountsCount: "26907",
  },
  {
    date: "2021-06-28 23:59:59",
    accountsCount: "17238",
  },
  {
    date: "2021-07-05 23:59:59",
    accountsCount: "18724",
  },
  {
    date: "2021-07-12 23:59:59",
    accountsCount: "23381",
  },
  {
    date: "2021-07-19 23:59:59",
    accountsCount: "23074",
  },
  {
    date: "2021-07-26 23:59:59",
    accountsCount: "39627",
  },
  {
    date: "2021-08-02 23:59:59",
    accountsCount: "54034",
  },
  {
    date: "2021-08-09 23:59:59",
    accountsCount: "66851",
  },
  {
    date: "2021-08-16 23:59:59",
    accountsCount: "26239",
  },
  {
    date: "2021-08-23 23:59:59",
    accountsCount: "71301",
  },
  {
    date: "2021-08-30 23:59:59",
    accountsCount: "162917",
  },
  {
    date: "2021-09-06 23:59:59",
    accountsCount: "186303",
  },
];
let LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = null;
let ACTIVE_ACCOUNTS_LIST = [
  {
    account: "app.nearcrowd.near",
    transactionsCount: "819667",
  },
  {
    account: "coin-op.near",
    transactionsCount: "346277",
  },
  {
    account: "relayer.bridge.near",
    transactionsCount: "44898",
  },
  {
    account: "paras.near",
    transactionsCount: "19352",
  },
  {
    account: "dec0dos.near",
    transactionsCount: "17122",
  },
  {
    account: "7747991786f445efb658b69857eadc7a57b6b475beec26ed14da8bc35bb2b5b6",
    transactionsCount: "12612",
  },
  {
    account: "runner3.paras.near",
    transactionsCount: "8985",
  },
  {
    account: "feiyu.near",
    transactionsCount: "8159",
  },
  {
    account: "runner1.paras.near",
    transactionsCount: "7645",
  },
  {
    account: "runner2.paras.near",
    transactionsCount: "6646",
  },
];
let ACCOUNTS_COUNT_IN_GENESIS = null;

// contracts
let NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = [
  {
    date: "2020-07-24 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-09 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-11 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-12 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2020-08-18 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-19 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-21 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-08-23 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-24 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-08-25 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-26 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2020-08-27 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-28 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-08-29 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2020-08-31 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-09-01 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-09-03 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-09-04 23:59:59",
    contractsCount: 25,
  },
  {
    date: "2020-09-05 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2020-09-07 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-09-08 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-09-09 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-09-10 23:59:59",
    contractsCount: 226,
  },
  {
    date: "2020-09-11 23:59:59",
    contractsCount: 1077,
  },
  {
    date: "2020-09-12 23:59:59",
    contractsCount: 244,
  },
  {
    date: "2020-09-13 23:59:59",
    contractsCount: 205,
  },
  {
    date: "2020-09-14 23:59:59",
    contractsCount: 274,
  },
  {
    date: "2020-09-15 23:59:59",
    contractsCount: 261,
  },
  {
    date: "2020-09-16 23:59:59",
    contractsCount: 234,
  },
  {
    date: "2020-09-17 23:59:59",
    contractsCount: 61,
  },
  {
    date: "2020-09-18 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2020-09-19 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2020-09-20 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-09-21 23:59:59",
    contractsCount: 11,
  },
  {
    date: "2020-09-22 23:59:59",
    contractsCount: 11,
  },
  {
    date: "2020-09-23 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2020-09-24 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2020-09-25 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-09-27 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-09-28 23:59:59",
    contractsCount: 200,
  },
  {
    date: "2020-09-29 23:59:59",
    contractsCount: 719,
  },
  {
    date: "2020-09-30 23:59:59",
    contractsCount: 187,
  },
  {
    date: "2020-10-01 23:59:59",
    contractsCount: 984,
  },
  {
    date: "2020-10-02 23:59:59",
    contractsCount: 1147,
  },
  {
    date: "2020-10-03 23:59:59",
    contractsCount: 301,
  },
  {
    date: "2020-10-04 23:59:59",
    contractsCount: 58,
  },
  {
    date: "2020-10-05 23:59:59",
    contractsCount: 110,
  },
  {
    date: "2020-10-06 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2020-10-07 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2020-10-08 23:59:59",
    contractsCount: 129,
  },
  {
    date: "2020-10-09 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2020-10-10 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-10-12 23:59:59",
    contractsCount: 130,
  },
  {
    date: "2020-10-13 23:59:59",
    contractsCount: 423,
  },
  {
    date: "2020-10-14 23:59:59",
    contractsCount: 53,
  },
  {
    date: "2020-10-15 23:59:59",
    contractsCount: 37,
  },
  {
    date: "2020-10-16 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-10-17 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2020-10-18 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-10-19 23:59:59",
    contractsCount: 65,
  },
  {
    date: "2020-10-20 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-10-21 23:59:59",
    contractsCount: 73,
  },
  {
    date: "2020-10-22 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2020-10-23 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2020-10-24 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-10-25 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-10-26 23:59:59",
    contractsCount: 37,
  },
  {
    date: "2020-10-27 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-28 23:59:59",
    contractsCount: 13,
  },
  {
    date: "2020-10-29 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-10-30 23:59:59",
    contractsCount: 56,
  },
  {
    date: "2020-11-01 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-11-02 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-03 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-04 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2020-11-05 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2020-11-06 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2020-11-07 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2020-11-08 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-11-09 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-11-10 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2020-11-11 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-12 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2020-11-13 23:59:59",
    contractsCount: 11,
  },
  {
    date: "2020-11-14 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-11-15 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-11-16 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-11-17 23:59:59",
    contractsCount: 15,
  },
  {
    date: "2020-11-18 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-19 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-20 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-11-21 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2020-11-22 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-23 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-24 23:59:59",
    contractsCount: 35,
  },
  {
    date: "2020-11-25 23:59:59",
    contractsCount: 13,
  },
  {
    date: "2020-11-26 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-27 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-11-28 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-11-29 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-11-30 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-12-01 23:59:59",
    contractsCount: 128,
  },
  {
    date: "2020-12-02 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2020-12-04 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2020-12-05 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-12-06 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-12-07 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-12-08 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-12-09 23:59:59",
    contractsCount: 42,
  },
  {
    date: "2020-12-10 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-12-11 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-12-12 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2020-12-13 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2020-12-14 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2020-12-15 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2020-12-16 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-12-17 23:59:59",
    contractsCount: 54,
  },
  {
    date: "2020-12-18 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2020-12-19 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-12-20 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2020-12-21 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2020-12-22 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2020-12-23 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2020-12-24 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-12-25 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-12-28 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2020-12-29 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-12-30 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-01-01 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-01-02 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-01-03 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-01-04 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-01-05 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-01-06 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-01-07 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-01-08 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2021-01-09 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-01-10 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-01-11 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-01-12 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-01-13 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-01-14 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-01-15 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-01-16 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2021-01-17 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-01-18 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-01-19 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2021-01-20 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2021-01-21 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2021-01-22 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-01-23 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-01-24 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-01-25 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-01-26 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-01-27 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-01-28 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-01-29 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-01-30 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2021-01-31 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-02-01 23:59:59",
    contractsCount: 11,
  },
  {
    date: "2021-02-02 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-02-03 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-02-04 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-02-05 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-02-06 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-02-07 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-02-08 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-02-09 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2021-02-10 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-02-11 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-02-12 23:59:59",
    contractsCount: 13,
  },
  {
    date: "2021-02-13 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-02-14 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-02-15 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-02-16 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-02-17 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2021-02-18 23:59:59",
    contractsCount: 11,
  },
  {
    date: "2021-02-19 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-02-20 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2021-02-21 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-02-22 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-02-23 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2021-02-24 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-02-25 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-02-26 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-02-27 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-02-28 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-03-01 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2021-03-02 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-03-03 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-03-04 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-03-05 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-03-06 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-03-07 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-03-08 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2021-03-09 23:59:59",
    contractsCount: 13,
  },
  {
    date: "2021-03-10 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-03-11 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-03-12 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2021-03-13 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-03-14 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2021-03-15 23:59:59",
    contractsCount: 25,
  },
  {
    date: "2021-03-16 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2021-03-17 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-03-18 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-03-19 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-03-20 23:59:59",
    contractsCount: 11,
  },
  {
    date: "2021-03-21 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-03-22 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2021-03-23 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-03-24 23:59:59",
    contractsCount: 36,
  },
  {
    date: "2021-03-25 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2021-03-26 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-03-27 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2021-03-28 23:59:59",
    contractsCount: 8,
  },
  {
    date: "2021-03-29 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-03-30 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-03-31 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-04-01 23:59:59",
    contractsCount: 15,
  },
  {
    date: "2021-04-02 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-04-03 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-04-04 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-04-05 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-04-06 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2021-04-07 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-04-08 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-04-09 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-04-10 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-04-11 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2021-04-12 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2021-04-13 23:59:59",
    contractsCount: 7,
  },
  {
    date: "2021-04-14 23:59:59",
    contractsCount: 12,
  },
  {
    date: "2021-04-15 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2021-04-16 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-04-17 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2021-04-18 23:59:59",
    contractsCount: 4,
  },
  {
    date: "2021-04-19 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2021-04-20 23:59:59",
    contractsCount: 13,
  },
  {
    date: "2021-04-21 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2021-04-22 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2021-04-23 23:59:59",
    contractsCount: 68,
  },
  {
    date: "2021-04-24 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-04-25 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2021-04-26 23:59:59",
    contractsCount: 68,
  },
  {
    date: "2021-04-27 23:59:59",
    contractsCount: 59,
  },
  {
    date: "2021-04-28 23:59:59",
    contractsCount: 38,
  },
  {
    date: "2021-04-29 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2021-04-30 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2021-05-01 23:59:59",
    contractsCount: 39,
  },
  {
    date: "2021-05-02 23:59:59",
    contractsCount: 34,
  },
  {
    date: "2021-05-03 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-05-04 23:59:59",
    contractsCount: 34,
  },
  {
    date: "2021-05-05 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2021-05-06 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-05-07 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2021-05-08 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-05-09 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2021-05-10 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2021-05-11 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2021-05-12 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2021-05-13 23:59:59",
    contractsCount: 18,
  },
  {
    date: "2021-05-14 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-05-15 23:59:59",
    contractsCount: 35,
  },
  {
    date: "2021-05-16 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-05-17 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-05-18 23:59:59",
    contractsCount: 15,
  },
  {
    date: "2021-05-19 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-05-20 23:59:59",
    contractsCount: 48,
  },
  {
    date: "2021-05-21 23:59:59",
    contractsCount: 93,
  },
  {
    date: "2021-05-22 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2021-05-23 23:59:59",
    contractsCount: 48,
  },
  {
    date: "2021-05-24 23:59:59",
    contractsCount: 45,
  },
  {
    date: "2021-05-25 23:59:59",
    contractsCount: 53,
  },
  {
    date: "2021-05-26 23:59:59",
    contractsCount: 80,
  },
  {
    date: "2021-05-27 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2021-05-28 23:59:59",
    contractsCount: 39,
  },
  {
    date: "2021-05-29 23:59:59",
    contractsCount: 45,
  },
  {
    date: "2021-05-30 23:59:59",
    contractsCount: 42,
  },
  {
    date: "2021-05-31 23:59:59",
    contractsCount: 48,
  },
  {
    date: "2021-06-01 23:59:59",
    contractsCount: 36,
  },
  {
    date: "2021-06-02 23:59:59",
    contractsCount: 37,
  },
  {
    date: "2021-06-03 23:59:59",
    contractsCount: 41,
  },
  {
    date: "2021-06-04 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2021-06-05 23:59:59",
    contractsCount: 44,
  },
  {
    date: "2021-06-06 23:59:59",
    contractsCount: 38,
  },
  {
    date: "2021-06-07 23:59:59",
    contractsCount: 38,
  },
  {
    date: "2021-06-08 23:59:59",
    contractsCount: 41,
  },
  {
    date: "2021-06-09 23:59:59",
    contractsCount: 39,
  },
  {
    date: "2021-06-10 23:59:59",
    contractsCount: 34,
  },
  {
    date: "2021-06-11 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2021-06-12 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2021-06-13 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2021-06-14 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-06-15 23:59:59",
    contractsCount: 52,
  },
  {
    date: "2021-06-16 23:59:59",
    contractsCount: 34,
  },
  {
    date: "2021-06-17 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2021-06-18 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-06-19 23:59:59",
    contractsCount: 31,
  },
  {
    date: "2021-06-20 23:59:59",
    contractsCount: 30,
  },
  {
    date: "2021-06-21 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-06-22 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-06-23 23:59:59",
    contractsCount: 30,
  },
  {
    date: "2021-06-24 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-06-25 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-06-26 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2021-06-27 23:59:59",
    contractsCount: 26,
  },
  {
    date: "2021-06-28 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-06-29 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-06-30 23:59:59",
    contractsCount: 26,
  },
  {
    date: "2021-07-01 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2021-07-02 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2021-07-03 23:59:59",
    contractsCount: 25,
  },
  {
    date: "2021-07-04 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-07-05 23:59:59",
    contractsCount: 18,
  },
  {
    date: "2021-07-06 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-07-07 23:59:59",
    contractsCount: 34,
  },
  {
    date: "2021-07-08 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2021-07-09 23:59:59",
    contractsCount: 36,
  },
  {
    date: "2021-07-10 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-07-11 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-07-12 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-07-13 23:59:59",
    contractsCount: 36,
  },
  {
    date: "2021-07-14 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-07-15 23:59:59",
    contractsCount: 18,
  },
  {
    date: "2021-07-16 23:59:59",
    contractsCount: 18,
  },
  {
    date: "2021-07-17 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-07-18 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-07-19 23:59:59",
    contractsCount: 31,
  },
  {
    date: "2021-07-20 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-07-21 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2021-07-22 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2021-07-23 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2021-07-24 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2021-07-25 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2021-07-26 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-07-27 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2021-07-28 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2021-07-29 23:59:59",
    contractsCount: 32,
  },
  {
    date: "2021-07-30 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2021-07-31 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-08-01 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2021-08-02 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2021-08-03 23:59:59",
    contractsCount: 15,
  },
  {
    date: "2021-08-04 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-08-05 23:59:59",
    contractsCount: 37,
  },
  {
    date: "2021-08-06 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-08-07 23:59:59",
    contractsCount: 25,
  },
  {
    date: "2021-08-08 23:59:59",
    contractsCount: 18,
  },
  {
    date: "2021-08-09 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2021-08-10 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-08-11 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2021-08-12 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2021-08-13 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2021-08-14 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-08-15 23:59:59",
    contractsCount: 18,
  },
  {
    date: "2021-08-16 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2021-08-17 23:59:59",
    contractsCount: 30,
  },
  {
    date: "2021-08-18 23:59:59",
    contractsCount: 41,
  },
  {
    date: "2021-08-19 23:59:59",
    contractsCount: 31,
  },
  {
    date: "2021-08-20 23:59:59",
    contractsCount: 31,
  },
  {
    date: "2021-08-21 23:59:59",
    contractsCount: 62,
  },
  {
    date: "2021-08-22 23:59:59",
    contractsCount: 53,
  },
  {
    date: "2021-08-23 23:59:59",
    contractsCount: 38,
  },
  {
    date: "2021-08-24 23:59:59",
    contractsCount: 38,
  },
  {
    date: "2021-08-25 23:59:59",
    contractsCount: 42,
  },
  {
    date: "2021-08-26 23:59:59",
    contractsCount: 31,
  },
  {
    date: "2021-08-27 23:59:59",
    contractsCount: 25,
  },
  {
    date: "2021-08-28 23:59:59",
    contractsCount: 39,
  },
  {
    date: "2021-08-29 23:59:59",
    contractsCount: 36,
  },
  {
    date: "2021-08-30 23:59:59",
    contractsCount: 37,
  },
  {
    date: "2021-08-31 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-09-01 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2021-09-02 23:59:59",
    contractsCount: 41,
  },
  {
    date: "2021-09-03 23:59:59",
    contractsCount: 44,
  },
  {
    date: "2021-09-04 23:59:59",
    contractsCount: 31,
  },
  {
    date: "2021-09-05 23:59:59",
    contractsCount: 43,
  },
  {
    date: "2021-09-06 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2021-09-07 23:59:59",
    contractsCount: 37,
  },
  {
    date: "2021-09-08 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2021-09-09 23:59:59",
    contractsCount: 68,
  },
  {
    date: "2021-09-10 23:59:59",
    contractsCount: 57,
  },
  {
    date: "2021-09-11 23:59:59",
    contractsCount: 42,
  },
  {
    date: "2021-09-12 23:59:59",
    contractsCount: 35,
  },
  {
    date: "2021-09-13 23:59:59",
    contractsCount: 42,
  },
  {
    date: "2021-09-14 23:59:59",
    contractsCount: 32,
  },
  {
    date: "2021-09-15 23:59:59",
    contractsCount: 44,
  },
  {
    date: "2021-09-16 23:59:59",
    contractsCount: 658,
  },
];
let ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = [
  {
    date: "2020-07-22 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-07-24 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-07-27 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-07-28 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-07-31 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-08-05 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-08-06 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-08-09 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-08-11 23:59:59",
    contractsCount: "1",
  },
  {
    date: "2020-08-12 23:59:59",
    contractsCount: "3",
  },
  {
    date: "2020-08-16 23:59:59",
    contractsCount: "2",
  },
  {
    date: "2020-08-18 23:59:59",
    contractsCount: "3",
  },
  {
    date: "2020-08-19 23:59:59",
    contractsCount: "2",
  },
  {
    date: "2020-08-21 23:59:59",
    contractsCount: "6",
  },
  {
    date: "2020-08-22 23:59:59",
    contractsCount: "4",
  },
  {
    date: "2020-08-23 23:59:59",
    contractsCount: "2",
  },
  {
    date: "2020-08-24 23:59:59",
    contractsCount: "6",
  },
  {
    date: "2020-08-25 23:59:59",
    contractsCount: "6",
  },
  {
    date: "2020-08-26 23:59:59",
    contractsCount: "7",
  },
  {
    date: "2020-08-27 23:59:59",
    contractsCount: "6",
  },
  {
    date: "2020-08-28 23:59:59",
    contractsCount: "8",
  },
  {
    date: "2020-08-29 23:59:59",
    contractsCount: "10",
  },
  {
    date: "2020-08-30 23:59:59",
    contractsCount: "3",
  },
  {
    date: "2020-08-31 23:59:59",
    contractsCount: "4",
  },
  {
    date: "2020-09-01 23:59:59",
    contractsCount: "10",
  },
  {
    date: "2020-09-02 23:59:59",
    contractsCount: "8",
  },
  {
    date: "2020-09-03 23:59:59",
    contractsCount: "12",
  },
  {
    date: "2020-09-04 23:59:59",
    contractsCount: "20",
  },
  {
    date: "2020-09-05 23:59:59",
    contractsCount: "11",
  },
  {
    date: "2020-09-06 23:59:59",
    contractsCount: "16",
  },
  {
    date: "2020-09-07 23:59:59",
    contractsCount: "14",
  },
  {
    date: "2020-09-08 23:59:59",
    contractsCount: "9",
  },
  {
    date: "2020-09-09 23:59:59",
    contractsCount: "13",
  },
  {
    date: "2020-09-10 23:59:59",
    contractsCount: "226",
  },
  {
    date: "2020-09-11 23:59:59",
    contractsCount: "1103",
  },
  {
    date: "2020-09-12 23:59:59",
    contractsCount: "272",
  },
  {
    date: "2020-09-13 23:59:59",
    contractsCount: "228",
  },
  {
    date: "2020-09-14 23:59:59",
    contractsCount: "321",
  },
  {
    date: "2020-09-15 23:59:59",
    contractsCount: "319",
  },
  {
    date: "2020-09-16 23:59:59",
    contractsCount: "300",
  },
  {
    date: "2020-09-17 23:59:59",
    contractsCount: "107",
  },
  {
    date: "2020-09-18 23:59:59",
    contractsCount: "108",
  },
  {
    date: "2020-09-19 23:59:59",
    contractsCount: "39",
  },
  {
    date: "2020-09-20 23:59:59",
    contractsCount: "26",
  },
  {
    date: "2020-09-21 23:59:59",
    contractsCount: "34",
  },
  {
    date: "2020-09-22 23:59:59",
    contractsCount: "42",
  },
  {
    date: "2020-09-23 23:59:59",
    contractsCount: "35",
  },
  {
    date: "2020-09-24 23:59:59",
    contractsCount: "72",
  },
  {
    date: "2020-09-25 23:59:59",
    contractsCount: "58",
  },
  {
    date: "2020-09-26 23:59:59",
    contractsCount: "36",
  },
  {
    date: "2020-09-27 23:59:59",
    contractsCount: "30",
  },
  {
    date: "2020-09-28 23:59:59",
    contractsCount: "237",
  },
  {
    date: "2020-09-29 23:59:59",
    contractsCount: "771",
  },
  {
    date: "2020-09-30 23:59:59",
    contractsCount: "309",
  },
  {
    date: "2020-10-01 23:59:59",
    contractsCount: "1105",
  },
  {
    date: "2020-10-02 23:59:59",
    contractsCount: "1495",
  },
  {
    date: "2020-10-03 23:59:59",
    contractsCount: "605",
  },
  {
    date: "2020-10-04 23:59:59",
    contractsCount: "258",
  },
  {
    date: "2020-10-05 23:59:59",
    contractsCount: "274",
  },
  {
    date: "2020-10-06 23:59:59",
    contractsCount: "128",
  },
  {
    date: "2020-10-07 23:59:59",
    contractsCount: "146",
  },
  {
    date: "2020-10-08 23:59:59",
    contractsCount: "255",
  },
  {
    date: "2020-10-09 23:59:59",
    contractsCount: "270",
  },
  {
    date: "2020-10-10 23:59:59",
    contractsCount: "102",
  },
  {
    date: "2020-10-11 23:59:59",
    contractsCount: "88",
  },
  {
    date: "2020-10-12 23:59:59",
    contractsCount: "355",
  },
  {
    date: "2020-10-13 23:59:59",
    contractsCount: "1238",
  },
  {
    date: "2020-10-14 23:59:59",
    contractsCount: "2296",
  },
  {
    date: "2020-10-15 23:59:59",
    contractsCount: "572",
  },
  {
    date: "2020-10-16 23:59:59",
    contractsCount: "366",
  },
  {
    date: "2020-10-17 23:59:59",
    contractsCount: "269",
  },
  {
    date: "2020-10-18 23:59:59",
    contractsCount: "223",
  },
  {
    date: "2020-10-19 23:59:59",
    contractsCount: "336",
  },
  {
    date: "2020-10-20 23:59:59",
    contractsCount: "298",
  },
  {
    date: "2020-10-21 23:59:59",
    contractsCount: "479",
  },
  {
    date: "2020-10-22 23:59:59",
    contractsCount: "356",
  },
  {
    date: "2020-10-23 23:59:59",
    contractsCount: "247",
  },
  {
    date: "2020-10-24 23:59:59",
    contractsCount: "219",
  },
  {
    date: "2020-10-25 23:59:59",
    contractsCount: "229",
  },
  {
    date: "2020-10-26 23:59:59",
    contractsCount: "270",
  },
  {
    date: "2020-10-27 23:59:59",
    contractsCount: "271",
  },
  {
    date: "2020-10-28 23:59:59",
    contractsCount: "366",
  },
  {
    date: "2020-10-29 23:59:59",
    contractsCount: "289",
  },
  {
    date: "2020-10-30 23:59:59",
    contractsCount: "306",
  },
  {
    date: "2020-10-31 23:59:59",
    contractsCount: "203",
  },
  {
    date: "2020-11-01 23:59:59",
    contractsCount: "188",
  },
  {
    date: "2020-11-02 23:59:59",
    contractsCount: "254",
  },
  {
    date: "2020-11-03 23:59:59",
    contractsCount: "218",
  },
  {
    date: "2020-11-04 23:59:59",
    contractsCount: "240",
  },
  {
    date: "2020-11-05 23:59:59",
    contractsCount: "361",
  },
  {
    date: "2020-11-06 23:59:59",
    contractsCount: "317",
  },
  {
    date: "2020-11-07 23:59:59",
    contractsCount: "236",
  },
  {
    date: "2020-11-08 23:59:59",
    contractsCount: "217",
  },
  {
    date: "2020-11-09 23:59:59",
    contractsCount: "319",
  },
  {
    date: "2020-11-10 23:59:59",
    contractsCount: "312",
  },
  {
    date: "2020-11-11 23:59:59",
    contractsCount: "241",
  },
  {
    date: "2020-11-12 23:59:59",
    contractsCount: "196",
  },
  {
    date: "2020-11-13 23:59:59",
    contractsCount: "242",
  },
  {
    date: "2020-11-14 23:59:59",
    contractsCount: "193",
  },
  {
    date: "2020-11-15 23:59:59",
    contractsCount: "173",
  },
  {
    date: "2020-11-16 23:59:59",
    contractsCount: "226",
  },
  {
    date: "2020-11-17 23:59:59",
    contractsCount: "273",
  },
  {
    date: "2020-11-18 23:59:59",
    contractsCount: "197",
  },
  {
    date: "2020-11-19 23:59:59",
    contractsCount: "187",
  },
  {
    date: "2020-11-20 23:59:59",
    contractsCount: "218",
  },
  {
    date: "2020-11-21 23:59:59",
    contractsCount: "331",
  },
  {
    date: "2020-11-22 23:59:59",
    contractsCount: "224",
  },
  {
    date: "2020-11-23 23:59:59",
    contractsCount: "251",
  },
  {
    date: "2020-11-24 23:59:59",
    contractsCount: "373",
  },
  {
    date: "2020-11-25 23:59:59",
    contractsCount: "272",
  },
  {
    date: "2020-11-26 23:59:59",
    contractsCount: "214",
  },
  {
    date: "2020-11-27 23:59:59",
    contractsCount: "223",
  },
  {
    date: "2020-11-28 23:59:59",
    contractsCount: "197",
  },
  {
    date: "2020-11-29 23:59:59",
    contractsCount: "181",
  },
  {
    date: "2020-11-30 23:59:59",
    contractsCount: "238",
  },
  {
    date: "2020-12-01 23:59:59",
    contractsCount: "364",
  },
  {
    date: "2020-12-02 23:59:59",
    contractsCount: "268",
  },
  {
    date: "2020-12-03 23:59:59",
    contractsCount: "207",
  },
  {
    date: "2020-12-04 23:59:59",
    contractsCount: "220",
  },
  {
    date: "2020-12-05 23:59:59",
    contractsCount: "182",
  },
  {
    date: "2020-12-06 23:59:59",
    contractsCount: "177",
  },
  {
    date: "2020-12-07 23:59:59",
    contractsCount: "245",
  },
  {
    date: "2020-12-08 23:59:59",
    contractsCount: "193",
  },
  {
    date: "2020-12-09 23:59:59",
    contractsCount: "233",
  },
  {
    date: "2020-12-10 23:59:59",
    contractsCount: "205",
  },
  {
    date: "2020-12-11 23:59:59",
    contractsCount: "219",
  },
  {
    date: "2020-12-12 23:59:59",
    contractsCount: "174",
  },
  {
    date: "2020-12-13 23:59:59",
    contractsCount: "187",
  },
  {
    date: "2020-12-14 23:59:59",
    contractsCount: "261",
  },
  {
    date: "2020-12-15 23:59:59",
    contractsCount: "302",
  },
  {
    date: "2020-12-16 23:59:59",
    contractsCount: "271",
  },
  {
    date: "2020-12-17 23:59:59",
    contractsCount: "295",
  },
  {
    date: "2020-12-18 23:59:59",
    contractsCount: "229",
  },
  {
    date: "2020-12-19 23:59:59",
    contractsCount: "217",
  },
  {
    date: "2020-12-20 23:59:59",
    contractsCount: "228",
  },
  {
    date: "2020-12-21 23:59:59",
    contractsCount: "412",
  },
  {
    date: "2020-12-22 23:59:59",
    contractsCount: "241",
  },
  {
    date: "2020-12-23 23:59:59",
    contractsCount: "270",
  },
  {
    date: "2020-12-24 23:59:59",
    contractsCount: "200",
  },
  {
    date: "2020-12-25 23:59:59",
    contractsCount: "181",
  },
  {
    date: "2020-12-26 23:59:59",
    contractsCount: "194",
  },
  {
    date: "2020-12-27 23:59:59",
    contractsCount: "233",
  },
  {
    date: "2020-12-28 23:59:59",
    contractsCount: "301",
  },
  {
    date: "2020-12-29 23:59:59",
    contractsCount: "192",
  },
  {
    date: "2020-12-30 23:59:59",
    contractsCount: "257",
  },
  {
    date: "2020-12-31 23:59:59",
    contractsCount: "234",
  },
  {
    date: "2021-01-01 23:59:59",
    contractsCount: "231",
  },
  {
    date: "2021-01-02 23:59:59",
    contractsCount: "215",
  },
  {
    date: "2021-01-03 23:59:59",
    contractsCount: "309",
  },
  {
    date: "2021-01-04 23:59:59",
    contractsCount: "277",
  },
  {
    date: "2021-01-05 23:59:59",
    contractsCount: "305",
  },
  {
    date: "2021-01-06 23:59:59",
    contractsCount: "270",
  },
  {
    date: "2021-01-07 23:59:59",
    contractsCount: "263",
  },
  {
    date: "2021-01-08 23:59:59",
    contractsCount: "343",
  },
  {
    date: "2021-01-09 23:59:59",
    contractsCount: "267",
  },
  {
    date: "2021-01-10 23:59:59",
    contractsCount: "255",
  },
  {
    date: "2021-01-11 23:59:59",
    contractsCount: "226",
  },
  {
    date: "2021-01-12 23:59:59",
    contractsCount: "220",
  },
  {
    date: "2021-01-13 23:59:59",
    contractsCount: "203",
  },
  {
    date: "2021-01-14 23:59:59",
    contractsCount: "256",
  },
  {
    date: "2021-01-15 23:59:59",
    contractsCount: "254",
  },
  {
    date: "2021-01-16 23:59:59",
    contractsCount: "414",
  },
  {
    date: "2021-01-17 23:59:59",
    contractsCount: "468",
  },
  {
    date: "2021-01-18 23:59:59",
    contractsCount: "409",
  },
  {
    date: "2021-01-19 23:59:59",
    contractsCount: "309",
  },
  {
    date: "2021-01-20 23:59:59",
    contractsCount: "291",
  },
  {
    date: "2021-01-21 23:59:59",
    contractsCount: "240",
  },
  {
    date: "2021-01-22 23:59:59",
    contractsCount: "222",
  },
  {
    date: "2021-01-23 23:59:59",
    contractsCount: "210",
  },
  {
    date: "2021-01-24 23:59:59",
    contractsCount: "264",
  },
  {
    date: "2021-01-25 23:59:59",
    contractsCount: "276",
  },
  {
    date: "2021-01-26 23:59:59",
    contractsCount: "209",
  },
  {
    date: "2021-01-27 23:59:59",
    contractsCount: "239",
  },
  {
    date: "2021-01-28 23:59:59",
    contractsCount: "228",
  },
  {
    date: "2021-01-29 23:59:59",
    contractsCount: "221",
  },
  {
    date: "2021-01-30 23:59:59",
    contractsCount: "218",
  },
  {
    date: "2021-01-31 23:59:59",
    contractsCount: "227",
  },
  {
    date: "2021-02-01 23:59:59",
    contractsCount: "277",
  },
  {
    date: "2021-02-02 23:59:59",
    contractsCount: "295",
  },
  {
    date: "2021-02-03 23:59:59",
    contractsCount: "302",
  },
  {
    date: "2021-02-04 23:59:59",
    contractsCount: "310",
  },
  {
    date: "2021-02-05 23:59:59",
    contractsCount: "407",
  },
  {
    date: "2021-02-06 23:59:59",
    contractsCount: "235",
  },
  {
    date: "2021-02-07 23:59:59",
    contractsCount: "454",
  },
  {
    date: "2021-02-08 23:59:59",
    contractsCount: "467",
  },
  {
    date: "2021-02-09 23:59:59",
    contractsCount: "352",
  },
  {
    date: "2021-02-10 23:59:59",
    contractsCount: "345",
  },
  {
    date: "2021-02-11 23:59:59",
    contractsCount: "311",
  },
  {
    date: "2021-02-12 23:59:59",
    contractsCount: "551",
  },
  {
    date: "2021-02-13 23:59:59",
    contractsCount: "425",
  },
  {
    date: "2021-02-14 23:59:59",
    contractsCount: "296",
  },
  {
    date: "2021-02-15 23:59:59",
    contractsCount: "330",
  },
  {
    date: "2021-02-16 23:59:59",
    contractsCount: "332",
  },
  {
    date: "2021-02-17 23:59:59",
    contractsCount: "289",
  },
  {
    date: "2021-02-18 23:59:59",
    contractsCount: "310",
  },
  {
    date: "2021-02-19 23:59:59",
    contractsCount: "274",
  },
  {
    date: "2021-02-20 23:59:59",
    contractsCount: "294",
  },
  {
    date: "2021-02-21 23:59:59",
    contractsCount: "240",
  },
  {
    date: "2021-02-22 23:59:59",
    contractsCount: "242",
  },
  {
    date: "2021-02-23 23:59:59",
    contractsCount: "235",
  },
  {
    date: "2021-02-24 23:59:59",
    contractsCount: "241",
  },
  {
    date: "2021-02-25 23:59:59",
    contractsCount: "309",
  },
  {
    date: "2021-02-26 23:59:59",
    contractsCount: "326",
  },
  {
    date: "2021-02-27 23:59:59",
    contractsCount: "221",
  },
  {
    date: "2021-02-28 23:59:59",
    contractsCount: "262",
  },
  {
    date: "2021-03-01 23:59:59",
    contractsCount: "312",
  },
  {
    date: "2021-03-02 23:59:59",
    contractsCount: "273",
  },
  {
    date: "2021-03-03 23:59:59",
    contractsCount: "372",
  },
  {
    date: "2021-03-04 23:59:59",
    contractsCount: "324",
  },
  {
    date: "2021-03-05 23:59:59",
    contractsCount: "254",
  },
  {
    date: "2021-03-06 23:59:59",
    contractsCount: "228",
  },
  {
    date: "2021-03-07 23:59:59",
    contractsCount: "231",
  },
  {
    date: "2021-03-08 23:59:59",
    contractsCount: "283",
  },
  {
    date: "2021-03-09 23:59:59",
    contractsCount: "584",
  },
  {
    date: "2021-03-10 23:59:59",
    contractsCount: "328",
  },
  {
    date: "2021-03-11 23:59:59",
    contractsCount: "519",
  },
  {
    date: "2021-03-12 23:59:59",
    contractsCount: "630",
  },
  {
    date: "2021-03-13 23:59:59",
    contractsCount: "410",
  },
  {
    date: "2021-03-14 23:59:59",
    contractsCount: "393",
  },
  {
    date: "2021-03-15 23:59:59",
    contractsCount: "370",
  },
  {
    date: "2021-03-16 23:59:59",
    contractsCount: "339",
  },
  {
    date: "2021-03-17 23:59:59",
    contractsCount: "274",
  },
  {
    date: "2021-03-18 23:59:59",
    contractsCount: "351",
  },
  {
    date: "2021-03-19 23:59:59",
    contractsCount: "302",
  },
  {
    date: "2021-03-20 23:59:59",
    contractsCount: "287",
  },
  {
    date: "2021-03-21 23:59:59",
    contractsCount: "231",
  },
  {
    date: "2021-03-22 23:59:59",
    contractsCount: "300",
  },
  {
    date: "2021-03-23 23:59:59",
    contractsCount: "260",
  },
  {
    date: "2021-03-24 23:59:59",
    contractsCount: "331",
  },
  {
    date: "2021-03-25 23:59:59",
    contractsCount: "250",
  },
  {
    date: "2021-03-26 23:59:59",
    contractsCount: "246",
  },
  {
    date: "2021-03-27 23:59:59",
    contractsCount: "205",
  },
  {
    date: "2021-03-28 23:59:59",
    contractsCount: "278",
  },
  {
    date: "2021-03-29 23:59:59",
    contractsCount: "288",
  },
  {
    date: "2021-03-30 23:59:59",
    contractsCount: "336",
  },
  {
    date: "2021-03-31 23:59:59",
    contractsCount: "302",
  },
  {
    date: "2021-04-01 23:59:59",
    contractsCount: "299",
  },
  {
    date: "2021-04-02 23:59:59",
    contractsCount: "280",
  },
  {
    date: "2021-04-03 23:59:59",
    contractsCount: "286",
  },
  {
    date: "2021-04-04 23:59:59",
    contractsCount: "224",
  },
  {
    date: "2021-04-05 23:59:59",
    contractsCount: "334",
  },
  {
    date: "2021-04-06 23:59:59",
    contractsCount: "524",
  },
  {
    date: "2021-04-07 23:59:59",
    contractsCount: "350",
  },
  {
    date: "2021-04-08 23:59:59",
    contractsCount: "331",
  },
  {
    date: "2021-04-09 23:59:59",
    contractsCount: "329",
  },
  {
    date: "2021-04-10 23:59:59",
    contractsCount: "315",
  },
  {
    date: "2021-04-11 23:59:59",
    contractsCount: "369",
  },
  {
    date: "2021-04-12 23:59:59",
    contractsCount: "430",
  },
  {
    date: "2021-04-13 23:59:59",
    contractsCount: "339",
  },
  {
    date: "2021-04-14 23:59:59",
    contractsCount: "324",
  },
  {
    date: "2021-04-15 23:59:59",
    contractsCount: "321",
  },
  {
    date: "2021-04-16 23:59:59",
    contractsCount: "345",
  },
  {
    date: "2021-04-17 23:59:59",
    contractsCount: "250",
  },
  {
    date: "2021-04-18 23:59:59",
    contractsCount: "272",
  },
  {
    date: "2021-04-19 23:59:59",
    contractsCount: "300",
  },
  {
    date: "2021-04-20 23:59:59",
    contractsCount: "279",
  },
  {
    date: "2021-04-21 23:59:59",
    contractsCount: "287",
  },
  {
    date: "2021-04-22 23:59:59",
    contractsCount: "330",
  },
  {
    date: "2021-04-23 23:59:59",
    contractsCount: "356",
  },
  {
    date: "2021-04-24 23:59:59",
    contractsCount: "267",
  },
  {
    date: "2021-04-25 23:59:59",
    contractsCount: "283",
  },
  {
    date: "2021-04-26 23:59:59",
    contractsCount: "437",
  },
  {
    date: "2021-04-27 23:59:59",
    contractsCount: "388",
  },
  {
    date: "2021-04-28 23:59:59",
    contractsCount: "328",
  },
  {
    date: "2021-04-29 23:59:59",
    contractsCount: "354",
  },
  {
    date: "2021-04-30 23:59:59",
    contractsCount: "342",
  },
  {
    date: "2021-05-01 23:59:59",
    contractsCount: "322",
  },
  {
    date: "2021-05-02 23:59:59",
    contractsCount: "300",
  },
  {
    date: "2021-05-03 23:59:59",
    contractsCount: "324",
  },
  {
    date: "2021-05-04 23:59:59",
    contractsCount: "306",
  },
  {
    date: "2021-05-05 23:59:59",
    contractsCount: "305",
  },
  {
    date: "2021-05-06 23:59:59",
    contractsCount: "327",
  },
  {
    date: "2021-05-07 23:59:59",
    contractsCount: "319",
  },
  {
    date: "2021-05-08 23:59:59",
    contractsCount: "287",
  },
  {
    date: "2021-05-09 23:59:59",
    contractsCount: "280",
  },
  {
    date: "2021-05-10 23:59:59",
    contractsCount: "291",
  },
  {
    date: "2021-05-11 23:59:59",
    contractsCount: "300",
  },
  {
    date: "2021-05-12 23:59:59",
    contractsCount: "443",
  },
  {
    date: "2021-05-13 23:59:59",
    contractsCount: "323",
  },
  {
    date: "2021-05-14 23:59:59",
    contractsCount: "361",
  },
  {
    date: "2021-05-15 23:59:59",
    contractsCount: "600",
  },
  {
    date: "2021-05-16 23:59:59",
    contractsCount: "348",
  },
  {
    date: "2021-05-17 23:59:59",
    contractsCount: "368",
  },
  {
    date: "2021-05-18 23:59:59",
    contractsCount: "370",
  },
  {
    date: "2021-05-19 23:59:59",
    contractsCount: "386",
  },
  {
    date: "2021-05-20 23:59:59",
    contractsCount: "364",
  },
  {
    date: "2021-05-21 23:59:59",
    contractsCount: "410",
  },
  {
    date: "2021-05-22 23:59:59",
    contractsCount: "321",
  },
  {
    date: "2021-05-23 23:59:59",
    contractsCount: "328",
  },
  {
    date: "2021-05-24 23:59:59",
    contractsCount: "363",
  },
  {
    date: "2021-05-25 23:59:59",
    contractsCount: "355",
  },
  {
    date: "2021-05-26 23:59:59",
    contractsCount: "458",
  },
  {
    date: "2021-05-27 23:59:59",
    contractsCount: "419",
  },
  {
    date: "2021-05-28 23:59:59",
    contractsCount: "374",
  },
  {
    date: "2021-05-29 23:59:59",
    contractsCount: "325",
  },
  {
    date: "2021-05-30 23:59:59",
    contractsCount: "354",
  },
  {
    date: "2021-05-31 23:59:59",
    contractsCount: "391",
  },
  {
    date: "2021-06-01 23:59:59",
    contractsCount: "347",
  },
  {
    date: "2021-06-02 23:59:59",
    contractsCount: "363",
  },
  {
    date: "2021-06-03 23:59:59",
    contractsCount: "389",
  },
  {
    date: "2021-06-04 23:59:59",
    contractsCount: "381",
  },
  {
    date: "2021-06-05 23:59:59",
    contractsCount: "358",
  },
  {
    date: "2021-06-06 23:59:59",
    contractsCount: "312",
  },
  {
    date: "2021-06-07 23:59:59",
    contractsCount: "386",
  },
  {
    date: "2021-06-08 23:59:59",
    contractsCount: "385",
  },
  {
    date: "2021-06-09 23:59:59",
    contractsCount: "370",
  },
  {
    date: "2021-06-10 23:59:59",
    contractsCount: "334",
  },
  {
    date: "2021-06-11 23:59:59",
    contractsCount: "346",
  },
  {
    date: "2021-06-12 23:59:59",
    contractsCount: "336",
  },
  {
    date: "2021-06-13 23:59:59",
    contractsCount: "314",
  },
  {
    date: "2021-06-14 23:59:59",
    contractsCount: "406",
  },
  {
    date: "2021-06-15 23:59:59",
    contractsCount: "415",
  },
  {
    date: "2021-06-16 23:59:59",
    contractsCount: "388",
  },
  {
    date: "2021-06-17 23:59:59",
    contractsCount: "369",
  },
  {
    date: "2021-06-18 23:59:59",
    contractsCount: "364",
  },
  {
    date: "2021-06-19 23:59:59",
    contractsCount: "348",
  },
  {
    date: "2021-06-20 23:59:59",
    contractsCount: "308",
  },
  {
    date: "2021-06-21 23:59:59",
    contractsCount: "397",
  },
  {
    date: "2021-06-22 23:59:59",
    contractsCount: "413",
  },
  {
    date: "2021-06-23 23:59:59",
    contractsCount: "355",
  },
  {
    date: "2021-06-24 23:59:59",
    contractsCount: "431",
  },
  {
    date: "2021-06-25 23:59:59",
    contractsCount: "347",
  },
  {
    date: "2021-06-26 23:59:59",
    contractsCount: "334",
  },
  {
    date: "2021-06-27 23:59:59",
    contractsCount: "326",
  },
  {
    date: "2021-06-28 23:59:59",
    contractsCount: "387",
  },
  {
    date: "2021-06-29 23:59:59",
    contractsCount: "334",
  },
  {
    date: "2021-06-30 23:59:59",
    contractsCount: "403",
  },
  {
    date: "2021-07-01 23:59:59",
    contractsCount: "413",
  },
  {
    date: "2021-07-02 23:59:59",
    contractsCount: "364",
  },
  {
    date: "2021-07-03 23:59:59",
    contractsCount: "321",
  },
  {
    date: "2021-07-04 23:59:59",
    contractsCount: "352",
  },
  {
    date: "2021-07-05 23:59:59",
    contractsCount: "369",
  },
  {
    date: "2021-07-06 23:59:59",
    contractsCount: "338",
  },
  {
    date: "2021-07-07 23:59:59",
    contractsCount: "417",
  },
  {
    date: "2021-07-08 23:59:59",
    contractsCount: "364",
  },
  {
    date: "2021-07-09 23:59:59",
    contractsCount: "352",
  },
  {
    date: "2021-07-10 23:59:59",
    contractsCount: "338",
  },
  {
    date: "2021-07-11 23:59:59",
    contractsCount: "300",
  },
  {
    date: "2021-07-12 23:59:59",
    contractsCount: "367",
  },
  {
    date: "2021-07-13 23:59:59",
    contractsCount: "345",
  },
  {
    date: "2021-07-14 23:59:59",
    contractsCount: "392",
  },
  {
    date: "2021-07-15 23:59:59",
    contractsCount: "362",
  },
  {
    date: "2021-07-16 23:59:59",
    contractsCount: "369",
  },
  {
    date: "2021-07-17 23:59:59",
    contractsCount: "337",
  },
  {
    date: "2021-07-18 23:59:59",
    contractsCount: "307",
  },
  {
    date: "2021-07-19 23:59:59",
    contractsCount: "357",
  },
  {
    date: "2021-07-20 23:59:59",
    contractsCount: "381",
  },
  {
    date: "2021-07-21 23:59:59",
    contractsCount: "323",
  },
  {
    date: "2021-07-22 23:59:59",
    contractsCount: "347",
  },
  {
    date: "2021-07-23 23:59:59",
    contractsCount: "360",
  },
  {
    date: "2021-07-24 23:59:59",
    contractsCount: "379",
  },
  {
    date: "2021-07-25 23:59:59",
    contractsCount: "389",
  },
  {
    date: "2021-07-26 23:59:59",
    contractsCount: "571",
  },
  {
    date: "2021-07-27 23:59:59",
    contractsCount: "405",
  },
  {
    date: "2021-07-28 23:59:59",
    contractsCount: "388",
  },
  {
    date: "2021-07-29 23:59:59",
    contractsCount: "367",
  },
  {
    date: "2021-07-30 23:59:59",
    contractsCount: "414",
  },
  {
    date: "2021-07-31 23:59:59",
    contractsCount: "456",
  },
  {
    date: "2021-08-01 23:59:59",
    contractsCount: "419",
  },
  {
    date: "2021-08-02 23:59:59",
    contractsCount: "423",
  },
  {
    date: "2021-08-03 23:59:59",
    contractsCount: "350",
  },
  {
    date: "2021-08-04 23:59:59",
    contractsCount: "419",
  },
  {
    date: "2021-08-05 23:59:59",
    contractsCount: "373",
  },
  {
    date: "2021-08-06 23:59:59",
    contractsCount: "412",
  },
  {
    date: "2021-08-07 23:59:59",
    contractsCount: "508",
  },
  {
    date: "2021-08-08 23:59:59",
    contractsCount: "469",
  },
  {
    date: "2021-08-09 23:59:59",
    contractsCount: "466",
  },
  {
    date: "2021-08-10 23:59:59",
    contractsCount: "425",
  },
  {
    date: "2021-08-11 23:59:59",
    contractsCount: "493",
  },
  {
    date: "2021-08-12 23:59:59",
    contractsCount: "559",
  },
  {
    date: "2021-08-13 23:59:59",
    contractsCount: "490",
  },
  {
    date: "2021-08-14 23:59:59",
    contractsCount: "439",
  },
  {
    date: "2021-08-15 23:59:59",
    contractsCount: "415",
  },
  {
    date: "2021-08-16 23:59:59",
    contractsCount: "525",
  },
  {
    date: "2021-08-17 23:59:59",
    contractsCount: "625",
  },
  {
    date: "2021-08-18 23:59:59",
    contractsCount: "752",
  },
  {
    date: "2021-08-19 23:59:59",
    contractsCount: "685",
  },
  {
    date: "2021-08-20 23:59:59",
    contractsCount: "626",
  },
  {
    date: "2021-08-21 23:59:59",
    contractsCount: "971",
  },
  {
    date: "2021-08-22 23:59:59",
    contractsCount: "926",
  },
  {
    date: "2021-08-23 23:59:59",
    contractsCount: "951",
  },
  {
    date: "2021-08-24 23:59:59",
    contractsCount: "756",
  },
  {
    date: "2021-08-25 23:59:59",
    contractsCount: "715",
  },
  {
    date: "2021-08-26 23:59:59",
    contractsCount: "647",
  },
  {
    date: "2021-08-27 23:59:59",
    contractsCount: "575",
  },
  {
    date: "2021-08-28 23:59:59",
    contractsCount: "630",
  },
  {
    date: "2021-08-29 23:59:59",
    contractsCount: "727",
  },
  {
    date: "2021-08-30 23:59:59",
    contractsCount: "659",
  },
  {
    date: "2021-08-31 23:59:59",
    contractsCount: "718",
  },
  {
    date: "2021-09-01 23:59:59",
    contractsCount: "688",
  },
  {
    date: "2021-09-02 23:59:59",
    contractsCount: "634",
  },
  {
    date: "2021-09-03 23:59:59",
    contractsCount: "1136",
  },
  {
    date: "2021-09-04 23:59:59",
    contractsCount: "629",
  },
  {
    date: "2021-09-05 23:59:59",
    contractsCount: "680",
  },
  {
    date: "2021-09-06 23:59:59",
    contractsCount: "728",
  },
  {
    date: "2021-09-07 23:59:59",
    contractsCount: "1019",
  },
  {
    date: "2021-09-08 23:59:59",
    contractsCount: "1620",
  },
  {
    date: "2021-09-09 23:59:59",
    contractsCount: "1112",
  },
  {
    date: "2021-09-10 23:59:59",
    contractsCount: "854",
  },
  {
    date: "2021-09-11 23:59:59",
    contractsCount: "761",
  },
  {
    date: "2021-09-12 23:59:59",
    contractsCount: "657",
  },
  {
    date: "2021-09-13 23:59:59",
    contractsCount: "755",
  },
  {
    date: "2021-09-14 23:59:59",
    contractsCount: "843",
  },
  {
    date: "2021-09-15 23:59:59",
    contractsCount: "741",
  },
  {
    date: "2021-09-16 23:59:59",
    contractsCount: "758",
  },
];

let UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = [
  {
    date: "2020-07-24 23:59:59",
    contractsCount: 1,
  },
  {
    date: "2020-08-09 23:59:59",
    contractsCount: 2,
  },
  {
    date: "2020-08-11 23:59:59",
    contractsCount: 3,
  },
  {
    date: "2020-08-12 23:59:59",
    contractsCount: 5,
  },
  {
    date: "2020-08-18 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-08-19 23:59:59",
    contractsCount: 6,
  },
  {
    date: "2020-08-21 23:59:59",
    contractsCount: 9,
  },
  {
    date: "2020-08-23 23:59:59",
    contractsCount: 10,
  },
  {
    date: "2020-08-24 23:59:59",
    contractsCount: 13,
  },
  {
    date: "2020-08-25 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2020-08-26 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2020-08-27 23:59:59",
    contractsCount: 14,
  },
  {
    date: "2020-08-28 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2020-08-29 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2020-08-31 23:59:59",
    contractsCount: 16,
  },
  {
    date: "2020-09-01 23:59:59",
    contractsCount: 17,
  },
  {
    date: "2020-09-03 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-04 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-05 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-07 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-08 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-09 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-10 23:59:59",
    contractsCount: 19,
  },
  {
    date: "2020-09-11 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-12 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-13 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-14 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-15 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-16 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-17 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-18 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-19 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-20 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-21 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-22 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-23 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-24 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-25 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-27 23:59:59",
    contractsCount: 20,
  },
  {
    date: "2020-09-28 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-09-29 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-09-30 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-01 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-02 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-03 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-04 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-05 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-06 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-07 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-08 23:59:59",
    contractsCount: 21,
  },
  {
    date: "2020-10-09 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-10 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-12 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-13 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-14 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-15 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-16 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-17 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-18 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-19 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-20 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-21 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-22 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-23 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-24 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-25 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-26 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-27 23:59:59",
    contractsCount: 22,
  },
  {
    date: "2020-10-28 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-10-29 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-10-30 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-11-01 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-11-02 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-11-03 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-11-04 23:59:59",
    contractsCount: 23,
  },
  {
    date: "2020-11-05 23:59:59",
    contractsCount: 24,
  },
  {
    date: "2020-11-06 23:59:59",
    contractsCount: 25,
  },
  {
    date: "2020-11-07 23:59:59",
    contractsCount: 26,
  },
  {
    date: "2020-11-08 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2020-11-09 23:59:59",
    contractsCount: 27,
  },
  {
    date: "2020-11-10 23:59:59",
    contractsCount: 28,
  },
  {
    date: "2020-11-11 23:59:59",
    contractsCount: 29,
  },
  {
    date: "2020-11-12 23:59:59",
    contractsCount: 33,
  },
  {
    date: "2020-11-13 23:59:59",
    contractsCount: 41,
  },
  {
    date: "2020-11-14 23:59:59",
    contractsCount: 43,
  },
  {
    date: "2020-11-15 23:59:59",
    contractsCount: 43,
  },
  {
    date: "2020-11-16 23:59:59",
    contractsCount: 43,
  },
  {
    date: "2020-11-17 23:59:59",
    contractsCount: 45,
  },
  {
    date: "2020-11-18 23:59:59",
    contractsCount: 45,
  },
  {
    date: "2020-11-19 23:59:59",
    contractsCount: 46,
  },
  {
    date: "2020-11-20 23:59:59",
    contractsCount: 46,
  },
  {
    date: "2020-11-21 23:59:59",
    contractsCount: 50,
  },
  {
    date: "2020-11-22 23:59:59",
    contractsCount: 51,
  },
  {
    date: "2020-11-23 23:59:59",
    contractsCount: 52,
  },
  {
    date: "2020-11-24 23:59:59",
    contractsCount: 52,
  },
  {
    date: "2020-11-25 23:59:59",
    contractsCount: 54,
  },
  {
    date: "2020-11-26 23:59:59",
    contractsCount: 55,
  },
  {
    date: "2020-11-27 23:59:59",
    contractsCount: 56,
  },
  {
    date: "2020-11-28 23:59:59",
    contractsCount: 56,
  },
  {
    date: "2020-11-29 23:59:59",
    contractsCount: 56,
  },
  {
    date: "2020-11-30 23:59:59",
    contractsCount: 56,
  },
  {
    date: "2020-12-01 23:59:59",
    contractsCount: 57,
  },
  {
    date: "2020-12-02 23:59:59",
    contractsCount: 57,
  },
  {
    date: "2020-12-04 23:59:59",
    contractsCount: 58,
  },
  {
    date: "2020-12-05 23:59:59",
    contractsCount: 64,
  },
  {
    date: "2020-12-06 23:59:59",
    contractsCount: 66,
  },
  {
    date: "2020-12-07 23:59:59",
    contractsCount: 66,
  },
  {
    date: "2020-12-08 23:59:59",
    contractsCount: 67,
  },
  {
    date: "2020-12-09 23:59:59",
    contractsCount: 68,
  },
  {
    date: "2020-12-10 23:59:59",
    contractsCount: 68,
  },
  {
    date: "2020-12-11 23:59:59",
    contractsCount: 68,
  },
  {
    date: "2020-12-12 23:59:59",
    contractsCount: 69,
  },
  {
    date: "2020-12-13 23:59:59",
    contractsCount: 70,
  },
  {
    date: "2020-12-14 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2020-12-15 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2020-12-16 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2020-12-17 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2020-12-18 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2020-12-19 23:59:59",
    contractsCount: 71,
  },
  {
    date: "2020-12-20 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-21 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-22 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-23 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-24 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-25 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-28 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-29 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2020-12-30 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2021-01-01 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2021-01-02 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2021-01-03 23:59:59",
    contractsCount: 72,
  },
  {
    date: "2021-01-04 23:59:59",
    contractsCount: 74,
  },
  {
    date: "2021-01-05 23:59:59",
    contractsCount: 76,
  },
  {
    date: "2021-01-06 23:59:59",
    contractsCount: 76,
  },
  {
    date: "2021-01-07 23:59:59",
    contractsCount: 76,
  },
  {
    date: "2021-01-08 23:59:59",
    contractsCount: 77,
  },
  {
    date: "2021-01-09 23:59:59",
    contractsCount: 79,
  },
  {
    date: "2021-01-10 23:59:59",
    contractsCount: 79,
  },
  {
    date: "2021-01-11 23:59:59",
    contractsCount: 81,
  },
  {
    date: "2021-01-12 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-13 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-14 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-15 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-16 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-17 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-18 23:59:59",
    contractsCount: 82,
  },
  {
    date: "2021-01-19 23:59:59",
    contractsCount: 83,
  },
  {
    date: "2021-01-20 23:59:59",
    contractsCount: 86,
  },
  {
    date: "2021-01-21 23:59:59",
    contractsCount: 86,
  },
  {
    date: "2021-01-22 23:59:59",
    contractsCount: 86,
  },
  {
    date: "2021-01-23 23:59:59",
    contractsCount: 86,
  },
  {
    date: "2021-01-24 23:59:59",
    contractsCount: 86,
  },
  {
    date: "2021-01-25 23:59:59",
    contractsCount: 88,
  },
  {
    date: "2021-01-26 23:59:59",
    contractsCount: 88,
  },
  {
    date: "2021-01-27 23:59:59",
    contractsCount: 88,
  },
  {
    date: "2021-01-28 23:59:59",
    contractsCount: 88,
  },
  {
    date: "2021-01-29 23:59:59",
    contractsCount: 88,
  },
  {
    date: "2021-01-30 23:59:59",
    contractsCount: 88,
  },
  {
    date: "2021-01-31 23:59:59",
    contractsCount: 89,
  },
  {
    date: "2021-02-01 23:59:59",
    contractsCount: 89,
  },
  {
    date: "2021-02-02 23:59:59",
    contractsCount: 89,
  },
  {
    date: "2021-02-03 23:59:59",
    contractsCount: 90,
  },
  {
    date: "2021-02-04 23:59:59",
    contractsCount: 90,
  },
  {
    date: "2021-02-05 23:59:59",
    contractsCount: 90,
  },
  {
    date: "2021-02-06 23:59:59",
    contractsCount: 90,
  },
  {
    date: "2021-02-07 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-08 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-09 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-10 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-11 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-12 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-13 23:59:59",
    contractsCount: 91,
  },
  {
    date: "2021-02-14 23:59:59",
    contractsCount: 93,
  },
  {
    date: "2021-02-15 23:59:59",
    contractsCount: 96,
  },
  {
    date: "2021-02-16 23:59:59",
    contractsCount: 97,
  },
  {
    date: "2021-02-17 23:59:59",
    contractsCount: 100,
  },
  {
    date: "2021-02-18 23:59:59",
    contractsCount: 102,
  },
  {
    date: "2021-02-19 23:59:59",
    contractsCount: 103,
  },
  {
    date: "2021-02-20 23:59:59",
    contractsCount: 105,
  },
  {
    date: "2021-02-21 23:59:59",
    contractsCount: 106,
  },
  {
    date: "2021-02-22 23:59:59",
    contractsCount: 110,
  },
  {
    date: "2021-02-23 23:59:59",
    contractsCount: 111,
  },
  {
    date: "2021-02-24 23:59:59",
    contractsCount: 112,
  },
  {
    date: "2021-02-25 23:59:59",
    contractsCount: 112,
  },
  {
    date: "2021-02-26 23:59:59",
    contractsCount: 112,
  },
  {
    date: "2021-02-27 23:59:59",
    contractsCount: 113,
  },
  {
    date: "2021-02-28 23:59:59",
    contractsCount: 116,
  },
  {
    date: "2021-03-01 23:59:59",
    contractsCount: 118,
  },
  {
    date: "2021-03-02 23:59:59",
    contractsCount: 126,
  },
  {
    date: "2021-03-03 23:59:59",
    contractsCount: 130,
  },
  {
    date: "2021-03-04 23:59:59",
    contractsCount: 130,
  },
  {
    date: "2021-03-05 23:59:59",
    contractsCount: 131,
  },
  {
    date: "2021-03-06 23:59:59",
    contractsCount: 131,
  },
  {
    date: "2021-03-07 23:59:59",
    contractsCount: 131,
  },
  {
    date: "2021-03-08 23:59:59",
    contractsCount: 132,
  },
  {
    date: "2021-03-09 23:59:59",
    contractsCount: 135,
  },
  {
    date: "2021-03-10 23:59:59",
    contractsCount: 137,
  },
  {
    date: "2021-03-11 23:59:59",
    contractsCount: 137,
  },
  {
    date: "2021-03-12 23:59:59",
    contractsCount: 140,
  },
  {
    date: "2021-03-13 23:59:59",
    contractsCount: 141,
  },
  {
    date: "2021-03-14 23:59:59",
    contractsCount: 142,
  },
  {
    date: "2021-03-15 23:59:59",
    contractsCount: 149,
  },
  {
    date: "2021-03-16 23:59:59",
    contractsCount: 151,
  },
  {
    date: "2021-03-17 23:59:59",
    contractsCount: 152,
  },
  {
    date: "2021-03-18 23:59:59",
    contractsCount: 154,
  },
  {
    date: "2021-03-19 23:59:59",
    contractsCount: 158,
  },
  {
    date: "2021-03-20 23:59:59",
    contractsCount: 161,
  },
  {
    date: "2021-03-21 23:59:59",
    contractsCount: 170,
  },
  {
    date: "2021-03-22 23:59:59",
    contractsCount: 171,
  },
  {
    date: "2021-03-23 23:59:59",
    contractsCount: 175,
  },
  {
    date: "2021-03-24 23:59:59",
    contractsCount: 175,
  },
  {
    date: "2021-03-25 23:59:59",
    contractsCount: 178,
  },
  {
    date: "2021-03-26 23:59:59",
    contractsCount: 178,
  },
  {
    date: "2021-03-27 23:59:59",
    contractsCount: 178,
  },
  {
    date: "2021-03-28 23:59:59",
    contractsCount: 178,
  },
  {
    date: "2021-03-29 23:59:59",
    contractsCount: 180,
  },
  {
    date: "2021-03-30 23:59:59",
    contractsCount: 182,
  },
  {
    date: "2021-03-31 23:59:59",
    contractsCount: 182,
  },
  {
    date: "2021-04-01 23:59:59",
    contractsCount: 184,
  },
  {
    date: "2021-04-02 23:59:59",
    contractsCount: 190,
  },
  {
    date: "2021-04-03 23:59:59",
    contractsCount: 195,
  },
  {
    date: "2021-04-04 23:59:59",
    contractsCount: 201,
  },
  {
    date: "2021-04-05 23:59:59",
    contractsCount: 202,
  },
  {
    date: "2021-04-06 23:59:59",
    contractsCount: 206,
  },
  {
    date: "2021-04-07 23:59:59",
    contractsCount: 207,
  },
  {
    date: "2021-04-08 23:59:59",
    contractsCount: 208,
  },
  {
    date: "2021-04-09 23:59:59",
    contractsCount: 212,
  },
  {
    date: "2021-04-10 23:59:59",
    contractsCount: 212,
  },
  {
    date: "2021-04-11 23:59:59",
    contractsCount: 212,
  },
  {
    date: "2021-04-12 23:59:59",
    contractsCount: 215,
  },
  {
    date: "2021-04-13 23:59:59",
    contractsCount: 215,
  },
  {
    date: "2021-04-14 23:59:59",
    contractsCount: 223,
  },
  {
    date: "2021-04-15 23:59:59",
    contractsCount: 224,
  },
  {
    date: "2021-04-16 23:59:59",
    contractsCount: 227,
  },
  {
    date: "2021-04-17 23:59:59",
    contractsCount: 233,
  },
  {
    date: "2021-04-18 23:59:59",
    contractsCount: 241,
  },
  {
    date: "2021-04-19 23:59:59",
    contractsCount: 245,
  },
  {
    date: "2021-04-20 23:59:59",
    contractsCount: 252,
  },
  {
    date: "2021-04-21 23:59:59",
    contractsCount: 263,
  },
  {
    date: "2021-04-22 23:59:59",
    contractsCount: 283,
  },
  {
    date: "2021-04-23 23:59:59",
    contractsCount: 287,
  },
  {
    date: "2021-04-24 23:59:59",
    contractsCount: 290,
  },
  {
    date: "2021-04-25 23:59:59",
    contractsCount: 292,
  },
  {
    date: "2021-04-26 23:59:59",
    contractsCount: 294,
  },
  {
    date: "2021-04-27 23:59:59",
    contractsCount: 301,
  },
  {
    date: "2021-04-28 23:59:59",
    contractsCount: 305,
  },
  {
    date: "2021-04-29 23:59:59",
    contractsCount: 308,
  },
  {
    date: "2021-04-30 23:59:59",
    contractsCount: 310,
  },
  {
    date: "2021-05-01 23:59:59",
    contractsCount: 332,
  },
  {
    date: "2021-05-02 23:59:59",
    contractsCount: 332,
  },
  {
    date: "2021-05-03 23:59:59",
    contractsCount: 333,
  },
  {
    date: "2021-05-04 23:59:59",
    contractsCount: 336,
  },
  {
    date: "2021-05-05 23:59:59",
    contractsCount: 336,
  },
  {
    date: "2021-05-06 23:59:59",
    contractsCount: 337,
  },
  {
    date: "2021-05-07 23:59:59",
    contractsCount: 339,
  },
  {
    date: "2021-05-08 23:59:59",
    contractsCount: 353,
  },
  {
    date: "2021-05-09 23:59:59",
    contractsCount: 366,
  },
  {
    date: "2021-05-10 23:59:59",
    contractsCount: 368,
  },
  {
    date: "2021-05-11 23:59:59",
    contractsCount: 369,
  },
  {
    date: "2021-05-12 23:59:59",
    contractsCount: 376,
  },
  {
    date: "2021-05-13 23:59:59",
    contractsCount: 376,
  },
  {
    date: "2021-05-14 23:59:59",
    contractsCount: 382,
  },
  {
    date: "2021-05-15 23:59:59",
    contractsCount: 383,
  },
  {
    date: "2021-05-16 23:59:59",
    contractsCount: 392,
  },
  {
    date: "2021-05-17 23:59:59",
    contractsCount: 403,
  },
  {
    date: "2021-05-18 23:59:59",
    contractsCount: 403,
  },
  {
    date: "2021-05-19 23:59:59",
    contractsCount: 404,
  },
  {
    date: "2021-05-20 23:59:59",
    contractsCount: 412,
  },
  {
    date: "2021-05-21 23:59:59",
    contractsCount: 423,
  },
  {
    date: "2021-05-22 23:59:59",
    contractsCount: 426,
  },
  {
    date: "2021-05-23 23:59:59",
    contractsCount: 430,
  },
  {
    date: "2021-05-24 23:59:59",
    contractsCount: 434,
  },
  {
    date: "2021-05-25 23:59:59",
    contractsCount: 437,
  },
  {
    date: "2021-05-26 23:59:59",
    contractsCount: 444,
  },
  {
    date: "2021-05-27 23:59:59",
    contractsCount: 447,
  },
  {
    date: "2021-05-28 23:59:59",
    contractsCount: 448,
  },
  {
    date: "2021-05-29 23:59:59",
    contractsCount: 448,
  },
  {
    date: "2021-05-30 23:59:59",
    contractsCount: 453,
  },
  {
    date: "2021-05-31 23:59:59",
    contractsCount: 455,
  },
  {
    date: "2021-06-01 23:59:59",
    contractsCount: 458,
  },
  {
    date: "2021-06-02 23:59:59",
    contractsCount: 458,
  },
  {
    date: "2021-06-03 23:59:59",
    contractsCount: 465,
  },
  {
    date: "2021-06-04 23:59:59",
    contractsCount: 471,
  },
  {
    date: "2021-06-05 23:59:59",
    contractsCount: 476,
  },
  {
    date: "2021-06-06 23:59:59",
    contractsCount: 476,
  },
  {
    date: "2021-06-07 23:59:59",
    contractsCount: 480,
  },
  {
    date: "2021-06-08 23:59:59",
    contractsCount: 480,
  },
  {
    date: "2021-06-09 23:59:59",
    contractsCount: 483,
  },
  {
    date: "2021-06-10 23:59:59",
    contractsCount: 483,
  },
  {
    date: "2021-06-11 23:59:59",
    contractsCount: 483,
  },
  {
    date: "2021-06-12 23:59:59",
    contractsCount: 487,
  },
  {
    date: "2021-06-13 23:59:59",
    contractsCount: 501,
  },
  {
    date: "2021-06-14 23:59:59",
    contractsCount: 504,
  },
  {
    date: "2021-06-15 23:59:59",
    contractsCount: 505,
  },
  {
    date: "2021-06-16 23:59:59",
    contractsCount: 508,
  },
  {
    date: "2021-06-17 23:59:59",
    contractsCount: 510,
  },
  {
    date: "2021-06-18 23:59:59",
    contractsCount: 518,
  },
  {
    date: "2021-06-19 23:59:59",
    contractsCount: 523,
  },
  {
    date: "2021-06-20 23:59:59",
    contractsCount: 527,
  },
  {
    date: "2021-06-21 23:59:59",
    contractsCount: 527,
  },
  {
    date: "2021-06-22 23:59:59",
    contractsCount: 527,
  },
  {
    date: "2021-06-23 23:59:59",
    contractsCount: 538,
  },
  {
    date: "2021-06-24 23:59:59",
    contractsCount: 538,
  },
  {
    date: "2021-06-25 23:59:59",
    contractsCount: 541,
  },
  {
    date: "2021-06-26 23:59:59",
    contractsCount: 554,
  },
  {
    date: "2021-06-27 23:59:59",
    contractsCount: 554,
  },
  {
    date: "2021-06-28 23:59:59",
    contractsCount: 555,
  },
  {
    date: "2021-06-29 23:59:59",
    contractsCount: 556,
  },
  {
    date: "2021-06-30 23:59:59",
    contractsCount: 556,
  },
  {
    date: "2021-07-01 23:59:59",
    contractsCount: 558,
  },
  {
    date: "2021-07-02 23:59:59",
    contractsCount: 559,
  },
  {
    date: "2021-07-03 23:59:59",
    contractsCount: 561,
  },
  {
    date: "2021-07-04 23:59:59",
    contractsCount: 562,
  },
  {
    date: "2021-07-05 23:59:59",
    contractsCount: 567,
  },
  {
    date: "2021-07-06 23:59:59",
    contractsCount: 575,
  },
  {
    date: "2021-07-07 23:59:59",
    contractsCount: 597,
  },
  {
    date: "2021-07-08 23:59:59",
    contractsCount: 624,
  },
  {
    date: "2021-07-09 23:59:59",
    contractsCount: 641,
  },
  {
    date: "2021-07-10 23:59:59",
    contractsCount: 653,
  },
  {
    date: "2021-07-11 23:59:59",
    contractsCount: 654,
  },
  {
    date: "2021-07-12 23:59:59",
    contractsCount: 660,
  },
  {
    date: "2021-07-13 23:59:59",
    contractsCount: 676,
  },
  {
    date: "2021-07-14 23:59:59",
    contractsCount: 680,
  },
  {
    date: "2021-07-15 23:59:59",
    contractsCount: 681,
  },
  {
    date: "2021-07-16 23:59:59",
    contractsCount: 685,
  },
  {
    date: "2021-07-17 23:59:59",
    contractsCount: 688,
  },
  {
    date: "2021-07-18 23:59:59",
    contractsCount: 689,
  },
  {
    date: "2021-07-19 23:59:59",
    contractsCount: 689,
  },
  {
    date: "2021-07-20 23:59:59",
    contractsCount: 691,
  },
  {
    date: "2021-07-21 23:59:59",
    contractsCount: 694,
  },
  {
    date: "2021-07-22 23:59:59",
    contractsCount: 695,
  },
  {
    date: "2021-07-23 23:59:59",
    contractsCount: 698,
  },
  {
    date: "2021-07-24 23:59:59",
    contractsCount: 698,
  },
  {
    date: "2021-07-25 23:59:59",
    contractsCount: 698,
  },
  {
    date: "2021-07-26 23:59:59",
    contractsCount: 698,
  },
  {
    date: "2021-07-27 23:59:59",
    contractsCount: 700,
  },
  {
    date: "2021-07-28 23:59:59",
    contractsCount: 701,
  },
  {
    date: "2021-07-29 23:59:59",
    contractsCount: 706,
  },
  {
    date: "2021-07-30 23:59:59",
    contractsCount: 708,
  },
  {
    date: "2021-07-31 23:59:59",
    contractsCount: 708,
  },
  {
    date: "2021-08-01 23:59:59",
    contractsCount: 708,
  },
  {
    date: "2021-08-02 23:59:59",
    contractsCount: 708,
  },
  {
    date: "2021-08-03 23:59:59",
    contractsCount: 710,
  },
  {
    date: "2021-08-04 23:59:59",
    contractsCount: 711,
  },
  {
    date: "2021-08-05 23:59:59",
    contractsCount: 723,
  },
  {
    date: "2021-08-06 23:59:59",
    contractsCount: 724,
  },
  {
    date: "2021-08-07 23:59:59",
    contractsCount: 724,
  },
  {
    date: "2021-08-08 23:59:59",
    contractsCount: 724,
  },
  {
    date: "2021-08-09 23:59:59",
    contractsCount: 726,
  },
  {
    date: "2021-08-10 23:59:59",
    contractsCount: 727,
  },
  {
    date: "2021-08-11 23:59:59",
    contractsCount: 727,
  },
  {
    date: "2021-08-12 23:59:59",
    contractsCount: 727,
  },
  {
    date: "2021-08-13 23:59:59",
    contractsCount: 727,
  },
  {
    date: "2021-08-14 23:59:59",
    contractsCount: 732,
  },
  {
    date: "2021-08-15 23:59:59",
    contractsCount: 733,
  },
  {
    date: "2021-08-16 23:59:59",
    contractsCount: 734,
  },
  {
    date: "2021-08-17 23:59:59",
    contractsCount: 734,
  },
  {
    date: "2021-08-18 23:59:59",
    contractsCount: 742,
  },
  {
    date: "2021-08-19 23:59:59",
    contractsCount: 743,
  },
  {
    date: "2021-08-20 23:59:59",
    contractsCount: 743,
  },
  {
    date: "2021-08-21 23:59:59",
    contractsCount: 746,
  },
  {
    date: "2021-08-22 23:59:59",
    contractsCount: 751,
  },
  {
    date: "2021-08-23 23:59:59",
    contractsCount: 752,
  },
  {
    date: "2021-08-24 23:59:59",
    contractsCount: 754,
  },
  {
    date: "2021-08-25 23:59:59",
    contractsCount: 754,
  },
  {
    date: "2021-08-26 23:59:59",
    contractsCount: 755,
  },
  {
    date: "2021-08-27 23:59:59",
    contractsCount: 757,
  },
  {
    date: "2021-08-28 23:59:59",
    contractsCount: 759,
  },
  {
    date: "2021-08-29 23:59:59",
    contractsCount: 763,
  },
  {
    date: "2021-08-30 23:59:59",
    contractsCount: 774,
  },
  {
    date: "2021-08-31 23:59:59",
    contractsCount: 779,
  },
  {
    date: "2021-09-01 23:59:59",
    contractsCount: 786,
  },
  {
    date: "2021-09-02 23:59:59",
    contractsCount: 790,
  },
  {
    date: "2021-09-03 23:59:59",
    contractsCount: 794,
  },
  {
    date: "2021-09-04 23:59:59",
    contractsCount: 799,
  },
  {
    date: "2021-09-05 23:59:59",
    contractsCount: 815,
  },
  {
    date: "2021-09-06 23:59:59",
    contractsCount: 820,
  },
  {
    date: "2021-09-07 23:59:59",
    contractsCount: 822,
  },
  {
    date: "2021-09-08 23:59:59",
    contractsCount: 825,
  },
  {
    date: "2021-09-09 23:59:59",
    contractsCount: 828,
  },
  {
    date: "2021-09-10 23:59:59",
    contractsCount: 828,
  },
  {
    date: "2021-09-11 23:59:59",
    contractsCount: 830,
  },
  {
    date: "2021-09-12 23:59:59",
    contractsCount: 833,
  },
  {
    date: "2021-09-13 23:59:59",
    contractsCount: 837,
  },
  {
    date: "2021-09-14 23:59:59",
    contractsCount: 837,
  },
  {
    date: "2021-09-15 23:59:59",
    contractsCount: 855,
  },
];
let ACTIVE_CONTRACTS_LIST = [
  {
    contract: "app.nearcrowd.near",
    receiptsCount: "2807686",
  },
  {
    contract: "near",
    receiptsCount: "696128",
  },
  {
    contract: "v2.ref-finance.near",
    receiptsCount: "191812",
  },
  {
    contract: "client.bridge.near",
    receiptsCount: "93083",
  },
  {
    contract: "x.paras.near",
    receiptsCount: "81456",
  },
  {
    contract: "wrap.near",
    receiptsCount: "78075",
  },
  {
    contract: "v2.ref-farming.near",
    receiptsCount: "67671",
  },
  {
    contract: "berryclub.ek.near",
    receiptsCount: "44558",
  },
  {
    contract: "skyward.near",
    receiptsCount: "41986",
  },
  {
    contract: "token.v2.ref-finance.near",
    receiptsCount: "27399",
  },
];

// partner
let PARTNER_TOTAL_TRANSACTIONS_COUNT = null;
let PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT = null;
let PARTNER_UNIQUE_USER_AMOUNT = null;

// This is a decorator that auto-retry failing function up to 5 times before giving up.
// If the wrapped function fails 5 times in a row, the result value is going to be undefined.
function retriable(wrapped) {
  return async function () {
    const functionName = wrapped.name;
    let result;
    for (let attempts = 1; ; ++attempts) {
      console.log(`${functionName} is getting executed...`);
      try {
        result = await wrapped.apply(this, arguments);
        break;
      } catch (error) {
        console.log(
          `WARNING: ${functionName} failed to execute ${attempts} times due to:`,
          error
        );
        if (attempts >= 5) {
          return;
        }
      }
    }
    console.log(`${functionName} has succeeded`);
    return result;
  };
}

// function that query from indexer
// transaction related
async function aggregateTransactionsCountByDate() {
  const transactionsCountAggregatedByDate = await queryTransactionsCountAggregatedByDate();
  TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = transactionsCountAggregatedByDate.map(
    ({ date: dateString, transactions_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      transactionsCount: transactions_count_by_date,
    })
  );
}
aggregateTransactionsCountByDate = retriable(aggregateTransactionsCountByDate);

async function aggregateGasUsedByDate() {
  const gasUsedByDate = await queryGasUsedAggregatedByDate();
  GAS_USED_BY_DATE = gasUsedByDate.map(
    ({ date: dateString, gas_used_by_date }) => ({
      date: formatDate(new Date(dateString)),
      gasUsed: gas_used_by_date,
    })
  );
}
aggregateGasUsedByDate = retriable(aggregateGasUsedByDate);

async function aggregateDepositAmountByDate() {
  const depositAmountByDate = await queryDepositAmountAggregatedByDate();
  DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = depositAmountByDate.map(
    ({ date: dateString, total_deposit_amount }) => ({
      date: formatDate(new Date(dateString)),
      depositAmount: total_deposit_amount,
    })
  );
}
aggregateDepositAmountByDate = retriable(aggregateDepositAmountByDate);

// accounts
async function aggregateNewAccountsCountByDate() {
  const newAccountsCountAggregatedByDate = await queryNewAccountsCountAggregatedByDate();
  NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = newAccountsCountAggregatedByDate.map(
    ({ date: dateString, new_accounts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: new_accounts_count_by_date,
    })
  );
}
aggregateNewAccountsCountByDate = retriable(aggregateNewAccountsCountByDate);

async function aggregateDeletedAccountsCountByDate() {
  const deletedAccountsCountAggregatedByDate = await queryDeletedAccountsCountAggregatedByDate();
  DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = deletedAccountsCountAggregatedByDate.map(
    ({ date: dateString, deleted_accounts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: deleted_accounts_count_by_date,
    })
  );
}
aggregateDeletedAccountsCountByDate = retriable(
  aggregateDeletedAccountsCountByDate
);

async function aggregateLiveAccountsCountByDate() {
  const genesisCount = await queryGenesisAccountCount();
  ACCOUNTS_COUNT_IN_GENESIS = genesisCount.count;
  if (
    NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE &&
    DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE
  ) {
    const startDate = NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[0].date;
    const dateArray = generateDateArray(startDate);
    let changedAccountsCountByDate = dateArray.map((date) => ({
      date: date,
      accountsCount: 0,
    }));
    changedAccountsCountByDate[0].accountsCount = Number(
      ACCOUNTS_COUNT_IN_GENESIS
    );

    let newAccountMap = new Map();
    for (let i = 0; i < NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
      newAccountMap.set(
        NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
        Number(NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
      );
    }

    let deletedAccountMap = new Map();
    for (let i = 0; i < DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
      deletedAccountMap.set(
        DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
        Number(DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
      );
    }

    for (let i = 0; i < changedAccountsCountByDate.length; i++) {
      const newAccountsCount = newAccountMap.get(
        changedAccountsCountByDate[i].date
      );
      if (newAccountsCount) {
        changedAccountsCountByDate[i].accountsCount += newAccountsCount;
      }
      const deletedAccountsCount = deletedAccountMap.get(
        changedAccountsCountByDate[i].date
      );
      if (deletedAccountsCount) {
        changedAccountsCountByDate[i].accountsCount -= deletedAccountsCount;
      }
    }
    LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = cumulativeAccountsCountArray(
      changedAccountsCountByDate
    );
  }
}
aggregateLiveAccountsCountByDate = retriable(aggregateLiveAccountsCountByDate);

async function aggregateActiveAccountsCountByDate() {
  const activeAccountsCountByDate = await queryActiveAccountsCountAggregatedByDate();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = activeAccountsCountByDate.map(
    ({ date: dateString, active_accounts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: active_accounts_count_by_date,
    })
  );
}
aggregateActiveAccountsCountByDate = retriable(
  aggregateActiveAccountsCountByDate
);

async function aggregateActiveAccountsCountByWeek() {
  const activeAccountsCountByWeek = await queryActiveAccountsCountAggregatedByWeek();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = activeAccountsCountByWeek.map(
    ({ date: dateString, active_accounts_count_by_week }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: active_accounts_count_by_week,
    })
  );
}
aggregateActiveAccountsCountByWeek = retriable(
  aggregateActiveAccountsCountByWeek
);

async function aggregateActiveAccountsList() {
  const activeAccountsList = await queryActiveAccountsList();
  ACTIVE_ACCOUNTS_LIST = activeAccountsList.map(
    ({
      signer_account_id: account,
      transactions_count: transactionsCount,
    }) => ({
      account,
      transactionsCount,
    })
  );
}
aggregateActiveAccountsList = retriable(aggregateActiveAccountsList);

// contracts
async function aggregateNewContractsCountByDate() {
  const newContractsByDate = await queryNewContractsCountAggregatedByDate();
  NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = newContractsByDate.map(
    ({ date: dateString, new_contracts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      contractsCount: new_contracts_count_by_date,
    })
  );
}
aggregateNewContractsCountByDate = retriable(aggregateNewContractsCountByDate);

async function aggregateActiveContractsCountByDate() {
  const activeContractsCountByDate = await queryActiveContractsCountAggregatedByDate();
  ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = activeContractsCountByDate.map(
    ({ date: dateString, active_contracts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      contractsCount: active_contracts_count_by_date,
    })
  );
}
aggregateActiveContractsCountByDate = retriable(
  aggregateActiveContractsCountByDate
);

async function aggregateUniqueDeployedContractsCountByDate() {
  const contractList = await queryUniqueDeployedContractsAggregatedByDate();
  const contractsRows = contractList.map(
    ({ date: dateString, deployed_contracts_by_date }) => ({
      date: formatDate(new Date(dateString)),
      deployedContracts: deployed_contracts_by_date,
    })
  );
  let cumulativeContractsDeployedByDate = new Array();
  let contractsDeployed = new Set([contractsRows[0].deployedContracts]);

  for (let i = 1; i < contractsRows.length; i++) {
    if (contractsRows[i].date !== contractsRows[i - 1].date) {
      cumulativeContractsDeployedByDate.push({
        date: contractsRows[i - 1].date,
        contractsCount: contractsDeployed.size,
      });
    }
    contractsDeployed.add(contractsRows[i].deployedContracts);
  }
  UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = cumulativeContractsDeployedByDate;
}
aggregateUniqueDeployedContractsCountByDate = retriable(
  aggregateUniqueDeployedContractsCountByDate
);

async function aggregateActiveContractsList() {
  const activeContractsList = await queryActiveContractsList();
  ACTIVE_CONTRACTS_LIST = activeContractsList.map(
    ({ receiver_account_id: contract, receipts_count: receiptsCount }) => ({
      contract,
      receiptsCount,
    })
  );
}
aggregateActiveContractsList = retriable(aggregateActiveContractsList);

// partner part
async function aggregatePartnerTotalTransactionsCount() {
  const partnerTotalTransactionList = await queryPartnerTotalTransactions();
  PARTNER_TOTAL_TRANSACTIONS_COUNT = partnerTotalTransactionList.map(
    ({
      receiver_account_id: account,
      transactions_count: transactionsCount,
    }) => ({
      account,
      transactionsCount,
    })
  );
}
aggregatePartnerTotalTransactionsCount = retriable(
  aggregatePartnerTotalTransactionsCount
);

async function aggregatePartnerFirst3MonthTransactionsCount() {
  const partnerFirst3MonthTransactionsCount = await queryPartnerFirstThreeMonthTransactions();
  PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT = partnerFirst3MonthTransactionsCount.map(
    ({
      receiver_account_id: account,
      transactions_count: transactionsCount,
    }) => ({
      account,
      transactionsCount,
    })
  );
}
aggregatePartnerFirst3MonthTransactionsCount = retriable(
  aggregatePartnerFirst3MonthTransactionsCount
);

async function aggregateParterUniqueUserAmount() {
  const partnerUniqueUserAmount = await queryPartnerUniqueUserAmount();
  PARTNER_UNIQUE_USER_AMOUNT = partnerUniqueUserAmount.map(
    ({ receiver_account_id: account, user_amount: userAmount }) => ({
      account,
      userAmount,
    })
  );
}
aggregateParterUniqueUserAmount = retriable(aggregateParterUniqueUserAmount);

// get function that exposed to frontend
// transaction related
async function getTransactionsByDate() {
  return TRANSACTIONS_COUNT_AGGREGATED_BY_DATE;
}

async function getGasUsedByDate() {
  return GAS_USED_BY_DATE;
}

async function getDepositAmountByDate() {
  return DEPOSIT_AMOUNT_AGGREGATED_BY_DATE;
}

//accounts
async function getNewAccountsCountByDate() {
  return NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getDeletedAccountCountBydate() {
  return DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getUniqueDeployedContractsCountByDate() {
  return UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveAccountsCountByDate() {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveAccountsCountByWeek() {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK;
}

async function getLiveAccountsCountByDate() {
  return LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE;
}

async function getActiveAccountsList() {
  return ACTIVE_ACCOUNTS_LIST;
}

// contracts
async function getNewContractsCountByDate() {
  return NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsCountByDate() {
  return ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsList() {
  return ACTIVE_CONTRACTS_LIST;
}

// partner part
async function getPartnerTotalTransactionsCount() {
  return PARTNER_TOTAL_TRANSACTIONS_COUNT;
}

async function getPartnerFirst3MonthTransactionsCount() {
  return PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT;
}

async function getPartnerUniqueUserAmount() {
  return PARTNER_UNIQUE_USER_AMOUNT;
}

// circulating supply
async function getLatestCirculatingSupply() {
  const latestCirculatingSupply = await queryLatestCirculatingSupply();
  return {
    timestamp: latestCirculatingSupply.computed_at_block_timestamp,
    circulating_supply_in_yoctonear:
      latestCirculatingSupply.circulating_tokens_supply,
  };
}

async function getGenesisAccountsCount() {
  return ACCOUNTS_COUNT_IN_GENESIS;
}

async function getTotalFee(daysCount) {
  return await calculateFeesByDay(daysCount);
}

// aggregate part
// transaction related
exports.aggregateTransactionsCountByDate = aggregateTransactionsCountByDate;
exports.aggregateGasUsedByDate = aggregateGasUsedByDate;
exports.aggregateDepositAmountByDate = aggregateDepositAmountByDate;

// accounts
exports.aggregateNewAccountsCountByDate = aggregateNewAccountsCountByDate;
exports.aggregateDeletedAccountsCountByDate = aggregateDeletedAccountsCountByDate;
exports.aggregateLiveAccountsCountByDate = aggregateLiveAccountsCountByDate;
exports.aggregateActiveAccountsCountByDate = aggregateActiveAccountsCountByDate;
exports.aggregateActiveAccountsCountByWeek = aggregateActiveAccountsCountByWeek;
exports.aggregateActiveAccountsList = aggregateActiveAccountsList;

// contracts
exports.aggregateNewContractsCountByDate = aggregateNewContractsCountByDate;
exports.aggregateActiveContractsCountByDate = aggregateActiveContractsCountByDate;
exports.aggregateUniqueDeployedContractsCountByDate = aggregateUniqueDeployedContractsCountByDate;
exports.aggregateActiveContractsList = aggregateActiveContractsList;

// partner part
exports.aggregatePartnerTotalTransactionsCount = aggregatePartnerTotalTransactionsCount;
exports.aggregatePartnerFirst3MonthTransactionsCount = aggregatePartnerFirst3MonthTransactionsCount;
exports.aggregateParterUniqueUserAmount = aggregateParterUniqueUserAmount;

// get method
// transaction related
exports.getTransactionsByDate = getTransactionsByDate;
exports.getGasUsedByDate = getGasUsedByDate;
exports.getDepositAmountByDate = getDepositAmountByDate;

// accounts
exports.getNewAccountsCountByDate = getNewAccountsCountByDate;
exports.getDeletedAccountCountBydate = getDeletedAccountCountBydate;
exports.getActiveAccountsCountByDate = getActiveAccountsCountByDate;
exports.getActiveAccountsCountByWeek = getActiveAccountsCountByWeek;
exports.getActiveAccountsList = getActiveAccountsList;
exports.getLiveAccountsCountByDate = getLiveAccountsCountByDate;

// contracts
exports.getNewContractsCountByDate = getNewContractsCountByDate;
exports.getUniqueDeployedContractsCountByDate = getUniqueDeployedContractsCountByDate;
exports.getActiveContractsCountByDate = getActiveContractsCountByDate;
exports.getActiveContractsList = getActiveContractsList;

// partner part
exports.getPartnerTotalTransactionsCount = getPartnerTotalTransactionsCount;
exports.getPartnerFirst3MonthTransactionsCount = getPartnerFirst3MonthTransactionsCount;
exports.getPartnerUniqueUserAmount = getPartnerUniqueUserAmount;

// circulating supply
exports.getLatestCirculatingSupply = getLatestCirculatingSupply;

exports.getGenesisAccountsCount = getGenesisAccountsCount;
exports.getTotalFee = getTotalFee;
