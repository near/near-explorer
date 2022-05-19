import { merge } from "lodash";
import { NetworkName } from "./types";
import { HOUR, MINUTE, SECOND } from "./consts";
import { getOverrides } from "./common";

/*
To override a config parameter you should use a specific environment variable, following rules:

- variable should be prefixed with NEAR_EXPLORER_CONFIG;
- variable name should be CAPS_CASE'd target variable name;
- going deep into object should be delimited with double underscore.

For example, to override `config.accountIdSuffix.stakingPool.localhostnet` you should use variable
NEAR_EXPLORER_CONFIG__ACCOUNT_ID_SUFFIX__STAKING_POOL__LOCALHOSTNET
*/
export const config = merge(
  {
    archivalRpcUrl: "http://localhost:3030",
    networkName: "localhostnet" as NetworkName,
    accountIdSuffix: {
      lockup: "lockup.near",
      stakingPool: {
        mainnet: ".poolv1.near",
        testnet: undefined,
        guildnet: undefined,
        localhostnet: undefined,
      } as Record<NetworkName, string | undefined>,
    },

    intervals: {
      checkFinalityStatus: SECOND,
      checkChainBlockStats: SECOND,
      checkRecentTransactions: SECOND,
      checkNetworkInfo: SECOND,
      checkStakingPoolInfo: 15 * SECOND,
      checkStakingPoolStakeProposal: MINUTE,
      checkValidatorDescriptions: 10 * MINUTE,
      checkTransactionCountHistory: 10 * MINUTE,
      checkAggregatedStats: HOUR,
      checkPoolIds: 10 * MINUTE,
    },
    timeouts: {
      timeoutStakingPoolsInfo: MINUTE,
      timeoutStakingPoolStakeProposal: MINUTE,
      timeoutFetchValidatorsBailout: 2.5 * SECOND,
    },

    port: 10000,
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);
