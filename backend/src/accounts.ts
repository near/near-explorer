import BN from "bn.js";
import { sha256 } from "js-sha256";

import {
  AccountBasicInfo,
  AccountPagination,
  AccountTransactionsCount,
  PaginatedAccountBasicInfo,
} from "./client-types";
import { nearLockupAccountIdSuffix } from "./config";
import {
  queryIndexedAccount,
  queryAccountsList,
  queryAccountInfo,
  queryAccountOutcomeTransactionsCount,
  queryAccountIncomeTransactionsCount,
  queryAccountActivity,
} from "./db-utils";
import { callViewMethod, sendJsonRpc, sendJsonRpcQuery } from "./near";

import { getIndexerCompatibilityTransactionActionKinds } from "./transactions";

async function isAccountIndexed(accountId: string): Promise<boolean> {
  const account = await queryIndexedAccount(accountId);
  return Boolean(account?.account_id);
}

async function getAccountsList(
  limit: number,
  paginationIndexer?: AccountPagination
): Promise<PaginatedAccountBasicInfo[]> {
  const accountsList = await queryAccountsList(limit, paginationIndexer);
  return accountsList.map((account) => ({
    accountId: account.account_id,
    createdAtBlockTimestamp: parseInt(account.created_at_block_timestamp),
    accountIndex: parseInt(account.account_index),
  }));
}

async function getAccountTransactionsCount(
  accountId: string
): Promise<AccountTransactionsCount> {
  const [inTransactionsCount, outTransactionsCount] = await Promise.all([
    queryAccountOutcomeTransactionsCount(accountId),
    queryAccountIncomeTransactionsCount(accountId),
  ]);
  return {
    inTransactionsCount,
    outTransactionsCount,
  };
}

async function getAccountInfo(
  accountId: string
): Promise<AccountBasicInfo | null> {
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
}

async function getAccountActivity(accountId: string): Promise<unknown> {
  const accountActivity = await queryAccountActivity(accountId);
  if (!accountActivity) {
    return null;
  }
  const indexerCompatibilityTransactionActionKinds = getIndexerCompatibilityTransactionActionKinds();
  return accountActivity.map((activity) => ({
    timestamp: activity.timestamp,
    updateReason: activity.update_reason,
    nonstakedBalance: activity.nonstaked_balance,
    stakedBalance: activity.staked_balance,
    storageUsage: activity.storage_usage,
    signerId: activity.receipt_signer_id || activity.transaction_signer_id,
    receiverId:
      activity.receipt_receiver_id || activity.transaction_receiver_id,
    action: {
      kind: activity.transaction_transaction_kind
        ? indexerCompatibilityTransactionActionKinds.get(
            activity.transaction_transaction_kind
          )
        : activity.receipt_kind
        ? indexerCompatibilityTransactionActionKinds.get(activity.receipt_kind)
        : activity.update_reason,
      args: activity.transaction_args
        ? typeof activity.transaction_args === "string"
          ? JSON.parse(activity.transaction_args)
          : activity.transaction_args
        : typeof activity.receipt_args === "string"
        ? JSON.parse(activity.receipt_args)
        : activity.receipt_args,
    },
  }));
}

const getAccountDetails = async (accountId: string) => {
  function generateLockupAccountIdFromAccountId(): string {
    // copied from https://github.com/near/near-wallet/blob/f52a3b1a72b901d87ab2c9cee79770d697be2bd9/src/utils/wallet.js#L601
    return (
      sha256(Buffer.from(accountId)).substring(0, 40) +
      "." +
      nearLockupAccountIdSuffix
    );
  }

  function ignore_if_does_not_exist(error: any): null {
    if (
      typeof error.message === "string" &&
      (error.message.includes("doesn't exist") ||
        error.message.includes("does not exist") ||
        error.message.includes("MethodNotFound"))
    ) {
      return null;
    }
    throw error;
  }

  let lockupAccountId: string;
  if (accountId.endsWith(`.${nearLockupAccountIdSuffix}`)) {
    lockupAccountId = accountId;
  } else {
    lockupAccountId = generateLockupAccountIdFromAccountId();
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
    }).catch(ignore_if_does_not_exist),
    accountId !== lockupAccountId
      ? sendJsonRpcQuery("view_account", {
          finality: "final",
          account_id: lockupAccountId,
        }).catch(ignore_if_does_not_exist)
      : null,
    callViewMethod<string>(lockupAccountId, "get_locked_amount", {})
      .then((balance) => new BN(balance))
      .catch(ignore_if_does_not_exist),
    callViewMethod<string>(
      lockupAccountId,
      "get_staking_pool_account_id",
      {}
    ).catch(ignore_if_does_not_exist),
    sendJsonRpc("EXPERIMENTAL_protocol_config", { finality: "final" }),
  ]);

  if (accountInfo === null) {
    return null;
  }

  const storageUsage = new BN(accountInfo.storage_usage);
  const storageAmountPerByte = new BN(
    protocolConfig.runtime_config.storage_amount_per_byte
  );
  const stakedBalance = new BN(accountInfo.locked);
  const nonStakedBalance = new BN(accountInfo.amount);
  const minimumBalance = storageAmountPerByte.mul(storageUsage);
  const availableBalance = nonStakedBalance
    .add(stakedBalance)
    .sub(BN.max(stakedBalance, minimumBalance));

  let lockupDelegatedToStakingPoolBalance: BN | null = null;
  if (lockupStakingPoolAccountId) {
    lockupDelegatedToStakingPoolBalance = await callViewMethod<string>(
      lockupStakingPoolAccountId,
      "get_account_total_balance",
      {
        account_id: lockupAccountId,
      }
    )
      .then((balance) => new BN(balance))
      .catch(ignore_if_does_not_exist);
  }

  let totalBalance = stakedBalance.add(nonStakedBalance);
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
      totalBalance.iadd(lockupDelegatedToStakingPoolBalance);
    }
  } else {
    // TODO: could it be that `lockupLockedBalance` is null but we still have info?
    if (lockupAccountInfo && lockupLockedBalance) {
      // It is a regular account with lockup
      const lockupStakedBalance = new BN(lockupAccountInfo.locked);
      const lockupNonStakedBalance = new BN(lockupAccountInfo.amount);
      let lockupTotalBalance = lockupStakedBalance.add(lockupNonStakedBalance);
      if (lockupDelegatedToStakingPoolBalance) {
        lockupTotalBalance.iadd(lockupDelegatedToStakingPoolBalance);
      }
      totalBalance.iadd(lockupTotalBalance);
      lockupDetails = {
        accountId: lockupAccountId,
        totalBalance: lockupTotalBalance.toString(),
        lockedBalance: lockupLockedBalance.toString(),
        unlockedBalance: lockupTotalBalance.sub(lockupLockedBalance).toString(),
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

export {
  isAccountIndexed,
  getAccountsList,
  getAccountTransactionsCount,
  getAccountInfo,
  getAccountActivity,
  getAccountDetails,
};
