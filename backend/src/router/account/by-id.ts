import * as trpc from "@trpc/server";
import { sha256 } from "js-sha256";
import { z } from "zod";

import { config } from "@explorer/backend/config";
import { RequestContext } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";
import { div } from "@explorer/backend/database/utils";
import { getAccountTransactionsCount } from "@explorer/backend/router/account/utils";
import { validators } from "@explorer/backend/router/validators";
import * as nearApi from "@explorer/backend/utils/near";
import { ignoreIfDoesNotExist } from "@explorer/backend/utils/near";

const getLockupAccountId = async (
  accountId: string
): Promise<string | undefined> => {
  if (accountId.endsWith(`.${config.accountIdSuffix.lockup}`)) {
    return;
  }
  // copied from https://github.com/near/near-wallet/blob/f52a3b1a72b901d87ab2c9cee79770d697be2bd9/src/utils/wallet.js#L601
  const lockupAccountId = `${sha256(Buffer.from(accountId)).substring(0, 40)}.${
    config.accountIdSuffix.lockup
  }`;
  const account = await nearApi
    .sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: lockupAccountId,
    })
    .catch(ignoreIfDoesNotExist);
  if (!account) {
    return;
  }
  return lockupAccountId;
};

export const getAccountRpcData = (accountId: string) =>
  nearApi
    .sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: accountId,
    })
    .catch(ignoreIfDoesNotExist);

const getAccountDetails = async (accountId: string) => {
  const [accountInfo, lockupAccountId] = await Promise.all([
    getAccountRpcData(accountId),
    getLockupAccountId(accountId),
  ]);

  if (accountInfo === null) {
    return null;
  }

  return {
    storageUsage: accountInfo.storage_usage,
    stakedBalance: accountInfo.locked,
    nonStakedBalance: accountInfo.amount.toString(),
    lockupAccountId,
  };
};

const getAccountInfo = async (accountId: string) => {
  const selection = await indexerDatabase
    .selectFrom((eb) =>
      eb
        .selectFrom("accounts")
        .select([
          "account_id",
          "created_by_receipt_id",
          "deleted_by_receipt_id",
        ])
        .where("account_id", "=", accountId)
        .as("inneraccounts")
    )
    .leftJoin("receipts as creation_receipt", (jb) =>
      jb.onRef("creation_receipt.receipt_id", "=", "created_by_receipt_id")
    )
    .leftJoin("receipts as deletion_receipt", (jb) =>
      jb.onRef("deletion_receipt.receipt_id", "=", "deleted_by_receipt_id")
    )
    .where("account_id", "=", accountId)
    .select([
      "account_id as accountId",
      (eb) =>
        div(
          eb,
          "creation_receipt.included_in_block_timestamp",
          1000 * 1000,
          "createdAtTimestamp"
        ),
      "creation_receipt.originated_from_transaction_hash as createdByHash",
      (eb) =>
        div(
          eb,
          "deletion_receipt.included_in_block_timestamp",
          1000 * 1000,
          "deletedAtTimestamp"
        ),
      "deletion_receipt.originated_from_transaction_hash as deletedByHash",
    ])
    .executeTakeFirst();
  if (!selection) {
    return;
  }
  return {
    // TODO: Discover how to get rid of non-null type assertion
    accountId: selection.accountId!,
    created: selection.createdByHash
      ? {
          hash: selection.createdByHash,
          timestamp: parseInt(selection.createdAtTimestamp, 10),
        }
      : undefined,
    deleted: selection.deletedByHash
      ? {
          hash: selection.deletedByHash,
          timestamp: parseInt(selection.deletedAtTimestamp, 10),
        }
      : undefined,
  };
};

export const router = trpc
  .router<RequestContext>()
  .query("byIdOld", {
    input: z.strictObject({ id: validators.accountId }),
    resolve: async ({ input: { id } }) => {
      const [accountInfo, accountDetails] = await Promise.all([
        getAccountInfo(id),
        getAccountDetails(id),
      ]);
      if (!accountInfo) {
        return null;
      }
      return {
        ...accountInfo,
        details: accountDetails,
      };
    },
  })
  .query("byId", {
    input: z.strictObject({
      id: validators.accountId,
    }),
    resolve: async ({ input: { id } }) => {
      if (/[A-Z]/.test(id)) {
        return null;
      }
      const accountInfo = await getAccountInfo(id);
      if (!accountInfo) {
        return null;
      }
      const [accountDetails, nearCoreAccount, transactionsCount] =
        await Promise.all([
          getAccountDetails(id),
          nearApi
            .sendJsonRpcQuery("view_account", {
              finality: "final",
              account_id: id,
            })
            .catch(ignoreIfDoesNotExist),
          getAccountTransactionsCount(id),
        ]);
      if (!accountDetails) {
        return null;
      }
      return {
        id,
        isContract: nearCoreAccount
          ? nearCoreAccount.code_hash !== "11111111111111111111111111111111"
          : false,
        created: accountInfo.created,
        storageUsed: accountDetails.storageUsage,
        nonStakedBalance: accountDetails.nonStakedBalance,
        stakedBalance: accountDetails.stakedBalance,
        transactionsQuantity: transactionsCount
          ? transactionsCount.inTransactionsCount +
            transactionsCount.outTransactionsCount
          : undefined,
      };
    },
  });
