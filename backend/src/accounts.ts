import { sha256 } from "js-sha256";

import { AccountListInfo, AccountTransactionsCount } from "./types";
import { config } from "./config";
import {
  queryIndexedAccount,
  queryAccountsList,
  queryAccountInfo,
  queryIncomeTransactionsCountFromAnalytics,
  queryIncomeTransactionsCountFromIndexerForLastDay,
  queryOutcomeTransactionsCountFromAnalytics,
  queryOutcomeTransactionsCountFromIndexerForLastDay,
} from "./db-utils";
import { callViewMethod, sendJsonRpc, sendJsonRpcQuery } from "./near";
import { BIMax } from "./utils";

export const isAccountIndexed = async (accountId: string): Promise<boolean> => {
  const account = await queryIndexedAccount(accountId);
  return Boolean(account?.account_id);
};

export const getAccountsList = async (
  limit: number,
  lastAccountIndex: number | null
): Promise<AccountListInfo[]> => {
  const accountsList = await queryAccountsList(limit, lastAccountIndex);
  return accountsList.map((account) => ({
    accountId: account.account_id,
    accountIndex: parseInt(account.account_index),
  }));
};

const queryAccountIncomeTransactionsCount = async (accountId: string) => {
  const {
    in_transactions_count: inTxCountFromAnalytics,
    last_day_collected_timestamp: lastDayCollectedTimestamp,
  } = await queryIncomeTransactionsCountFromAnalytics(accountId);
  const inTxCountFromIndexer = await queryIncomeTransactionsCountFromIndexerForLastDay(
    accountId,
    lastDayCollectedTimestamp
  );
  return inTxCountFromAnalytics + inTxCountFromIndexer;
};

const queryAccountOutcomeTransactionsCount = async (accountId: string) => {
  const {
    out_transactions_count: outTxCountFromAnalytics,
    last_day_collected_timestamp: lastDayCollectedTimestamp,
  } = await queryOutcomeTransactionsCountFromAnalytics(accountId);
  const outTxCountFromIndexer = await queryOutcomeTransactionsCountFromIndexerForLastDay(
    accountId,
    lastDayCollectedTimestamp
  );
  return outTxCountFromAnalytics + outTxCountFromIndexer;
};

export const getAccountTransactionsCount = async (
  accountId: string
): Promise<AccountTransactionsCount> => {
  const [inTransactionsCount, outTransactionsCount] = await Promise.all([
    queryAccountOutcomeTransactionsCount(accountId),
    queryAccountIncomeTransactionsCount(accountId),
  ]);
  return {
    inTransactionsCount,
    outTransactionsCount,
  };
};

export const getAccountInfo = async (accountId: string) => {
  const accountInfo = await queryAccountInfo(accountId);
  if (!accountInfo) {
    return null;
  }
  return {
    accountId: accountInfo.account_id,
    createdByTransactionHash:
      accountInfo.created_by_transaction_hash || undefined,
    createdAtBlockTimestamp: accountInfo.created_at_block_timestamp
      ? parseInt(accountInfo.created_at_block_timestamp)
      : undefined,
    deletedByTransactionHash:
      accountInfo.deleted_by_transaction_hash || undefined,
    deletedAtBlockTimestamp: accountInfo.deleted_at_block_timestamp
      ? parseInt(accountInfo.deleted_at_block_timestamp)
      : undefined,
  };
};

function generateLockupAccountIdFromAccountId(accountId: string): string {
  // copied from https://github.com/near/near-wallet/blob/f52a3b1a72b901d87ab2c9cee79770d697be2bd9/src/utils/wallet.js#L601
  return (
    sha256(Buffer.from(accountId)).substring(0, 40) +
    "." +
    config.accountIdSuffix.lockup
  );
}

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return Boolean(
    typeof error === "object" &&
      error &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
  );
};

function ignoreIfDoesNotExist(error: unknown): null {
  if (
    isErrorWithMessage(error) &&
    (error.message.includes("doesn't exist") ||
      error.message.includes("does not exist") ||
      error.message.includes("MethodNotFound"))
  ) {
    return null;
  }
  throw error;
}

export const getAccountDetails = async (accountId: string) => {
  let lockupAccountId: string;
  if (accountId.endsWith(`.${config.accountIdSuffix.lockup}`)) {
    lockupAccountId = accountId;
  } else {
    lockupAccountId = generateLockupAccountIdFromAccountId(accountId);
  }

  const [
    accountInfo,
    lockupAccountInfo,
    lockupLockedBalance,
    lockupStakingPoolAccountId,
    protocolConfig,
  ] = await Promise.all([
    sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: accountId,
    }).catch(ignoreIfDoesNotExist),
    accountId !== lockupAccountId
      ? sendJsonRpcQuery("view_account", {
          finality: "final",
          account_id: lockupAccountId,
        }).catch(ignoreIfDoesNotExist)
      : null,
    callViewMethod<string>(lockupAccountId, "get_locked_amount", {})
      .then((balance) => BigInt(balance))
      .catch(ignoreIfDoesNotExist),
    callViewMethod<string>(
      lockupAccountId,
      "get_staking_pool_account_id",
      {}
    ).catch(ignoreIfDoesNotExist),
    sendJsonRpc("EXPERIMENTAL_protocol_config", { finality: "final" }),
  ]);

  if (accountInfo === null) {
    return null;
  }

  const storageUsage = BigInt(accountInfo.storage_usage);
  const storageAmountPerByte = BigInt(
    protocolConfig.runtime_config.storage_amount_per_byte
  );
  const stakedBalance = BigInt(accountInfo.locked);
  const nonStakedBalance = BigInt(accountInfo.amount);
  const minimumBalance = storageAmountPerByte * storageUsage;
  const availableBalance =
    nonStakedBalance + stakedBalance - BIMax(stakedBalance, minimumBalance);

  let lockupDelegatedToStakingPoolBalance: bigint | null = null;
  if (lockupStakingPoolAccountId) {
    lockupDelegatedToStakingPoolBalance = await callViewMethod<string>(
      lockupStakingPoolAccountId,
      "get_account_total_balance",
      {
        account_id: lockupAccountId,
      }
    )
      .then((balance) => BigInt(balance))
      .catch(ignoreIfDoesNotExist);
  }

  let totalBalance = stakedBalance + nonStakedBalance;
  let lockupDetails: {
    accountId: string;
    totalBalance: string;
    lockedBalance: string;
    unlockedBalance: string;
  } | null = null;
  // The following section could be compressed into more complicated checks,
  // but it is left in a readable form.
  if (accountId === lockupAccountId) {
    // It is a lockup account
    if (lockupDelegatedToStakingPoolBalance) {
      totalBalance += lockupDelegatedToStakingPoolBalance;
    }
  } else {
    // TODO: could it be that `lockupLockedBalance` is null but we still have info?
    if (lockupAccountInfo && lockupLockedBalance) {
      // It is a regular account with lockup
      const lockupStakedBalance = BigInt(lockupAccountInfo.locked);
      const lockupNonStakedBalance = BigInt(lockupAccountInfo.amount);
      let lockupTotalBalance = lockupStakedBalance + lockupNonStakedBalance;
      if (lockupDelegatedToStakingPoolBalance) {
        lockupTotalBalance += lockupDelegatedToStakingPoolBalance;
      }
      totalBalance = totalBalance + lockupTotalBalance;
      lockupDetails = {
        accountId: lockupAccountId,
        totalBalance: lockupTotalBalance.toString(),
        lockedBalance: lockupLockedBalance.toString(),
        unlockedBalance: (lockupTotalBalance - lockupLockedBalance).toString(),
      };
    }
    // It is a regular account without lockup
  }

  return {
    storageUsage: storageUsage.toString(),
    stakedBalance: stakedBalance.toString(),
    nonStakedBalance: nonStakedBalance.toString(),
    minimumBalance: minimumBalance.toString(),
    availableBalance: availableBalance.toString(),
    totalBalance: totalBalance.toString(),
    lockupAccountId: lockupDetails?.accountId,
    lockupTotalBalance: lockupDetails?.totalBalance,
    lockupLockedBalance: lockupDetails?.lockedBalance,
    lockupUnlockedBalance: lockupDetails?.unlockedBalance,
  };
};
