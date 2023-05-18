import { merge } from "lodash";

import { HOUR, MINUTE, SECOND } from "@/backend/utils/time";
import { NetworkName } from "@/common/types/common";
import { getOverrides } from "@/common/utils/environment";

/*
To override a config parameter you should use a specific environment variable, following rules:

- variable should be prefixed with NEAR_EXPLORER_CONFIG;
- variable name should be CAPS_CASE'd target variable name;
- going deep into object should be delimited with double underscore.

For example, to override `config.accountIdSuffix.stakingPool.localnet` you should use variable
NEAR_EXPLORER_CONFIG__ACCOUNT_ID_SUFFIX__STAKING_POOL__LOCALNET
*/
export const config = merge(
  {
    archivalRpcUrl: "http://localhost:3030",
    archivalRpcApiKey: "",
    networkName: "localnet" as NetworkName,
    offline: false,
    accountIdSuffix: {
      lockup: "lockup.near",
      stakingPool: {
        mainnet: ".poolv1.near",
        testnet: undefined,
        shardnet: undefined,
        guildnet: undefined,
        localnet: undefined,
      } as Record<NetworkName, string | undefined>,
    },

    intervals: {
      checkLatestBlock: SECOND,
      checkLatestGasPrice: 15 * SECOND,
      checkBlockProductionSpeed: 5 * SECOND,
      checkRecentTransactions: SECOND,
      checkNetworkInfo: SECOND,
      checkProtocolInfo: HOUR,
      checkOnlineNodesCount: SECOND,
      checkStakingPoolInfo: 15 * SECOND,
      checkStakingPoolStakeProposal: MINUTE,
      checkValidatorDescriptions: 10 * MINUTE,
      checkValidatorsTelemetry: SECOND,
      checkTransactionHistory: HOUR,
      checkAggregatedStats: HOUR,
      checkPoolIds: 10 * MINUTE,
      checkTokensSupply: HOUR,
      checkRpcStatus: 10 * SECOND,
      checkIndexerStatus: 10 * SECOND,
    },
    timeouts: {
      timeoutStakingPoolsInfo: MINUTE,
      timeoutStakingPoolStakeProposal: MINUTE,
      timeoutFetchValidatorsBailout: 2.5 * SECOND,
    },

    port: 10000,

    db: {
      readOnlyIndexer: {
        host: "",
        database: "",
        user: "",
        password: "",
      },
      readOnlyAnalytics: {
        host: "",
        database: "",
        user: "",
        password: "",
      },
      readOnlyTelemetry: {
        host: "",
        database: "",
        user: "",
        password: "",
      },
      writeOnlyTelemetry: {
        host: "",
        database: "",
        user: "",
        password: "",
        min: 0,
        max: 15,
      },
      readOnlyIndexerActivity: {
        host: "",
        database: "",
        user: "",
        password: "",
      },
    },
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);
