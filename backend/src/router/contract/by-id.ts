import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import {
  analyticsDatabase,
  Indexer,
  indexerDatabase,
} from "../../database/databases";
import { div } from "../../database/utils";
import * as nearApi from "../../utils/near";
import { validators } from "../validators";

const queryContractFromIndexer = async (accountId: string) => {
  // find the latest update in analytics db
  const latestUpdateResult = analyticsDatabase
    ? await analyticsDatabase
        .selectFrom("deployed_contracts")
        .select("deployed_at_block_timestamp as timestamp")
        .orderBy("deployed_at_block_timestamp", "desc")
        .limit(1)
        .executeTakeFirstOrThrow()
    : undefined;
  const latestUpdateTimestamp = latestUpdateResult
    ? latestUpdateResult.timestamp
    : "0";
  // query for the latest info from indexer
  // if it return 'undefined' then there was no update since deployed_at_block_timestamp
  const contractInfoFromIndexer = await indexerDatabase
    .selectFrom("action_receipt_actions")
    .leftJoin("receipts", (jb) =>
      jb.onRef("receipts.receipt_id", "=", "action_receipt_actions.receipt_id")
    )
    .select([
      (eb) =>
        div(
          eb,
          "receipts.included_in_block_timestamp",
          1000 * 1000,
          "timestamp"
        ),
      "receipts.originated_from_transaction_hash as hash",
    ])
    .where("action_kind", "=", "DEPLOY_CONTRACT")
    .where("receipt_receiver_account_id", "=", accountId)
    .where("receipt_included_in_block_timestamp", ">", latestUpdateTimestamp)
    .orderBy("receipt_included_in_block_timestamp", "desc")
    .limit(1)
    .executeTakeFirst();

  if (!contractInfoFromIndexer) {
    return;
  }

  return {
    timestamp: contractInfoFromIndexer.timestamp,
    // TODO: Discover how to get rid of non-null type assertion
    hash: contractInfoFromIndexer.hash!,
  };
};

const queryContractFromAnalytics = async (accountId: string) => {
  if (!analyticsDatabase) {
    return;
  }
  // query to analytics db to find latest historical record
  const contractInfoFromAnalytics = await analyticsDatabase
    .selectFrom("deployed_contracts")
    .select([
      "deployed_by_receipt_id as receiptId",
      (eb) => div(eb, "deployed_at_block_timestamp", 1000 * 1000, "timestamp"),
    ])
    .where("deployed_to_account_id", "=", accountId)
    .orderBy("deployed_at_block_timestamp", "desc")
    .limit(1)
    .executeTakeFirstOrThrow();

  // query for transaction hash where contact was deployed
  const transactionHashResult = await indexerDatabase
    .selectFrom("receipts")
    .select("originated_from_transaction_hash as hash")
    .where(
      "receipt_id",
      "=",
      // Different "flavors" in different DBs
      // there is no way to fix types but force casting
      contractInfoFromAnalytics.receiptId as Indexer.ReceiptsId
    )
    .limit(1)
    .executeTakeFirstOrThrow();

  if (!contractInfoFromAnalytics) {
    return;
  }

  return {
    timestamp: contractInfoFromAnalytics.timestamp,
    hash: transactionHashResult.hash,
  };
};

const queryContractInfo = async (accountId: string) => {
  const contractFromIndexer = await queryContractFromIndexer(accountId);
  if (contractFromIndexer) {
    return;
  }
  const contractFromAnalytics = await queryContractFromAnalytics(accountId);
  if (contractFromAnalytics) {
    return contractFromAnalytics;
  }
};

export const router = trpc.router<Context>().query("byId", {
  input: z.strictObject({ id: validators.accountId }),
  resolve: async ({ input: { id } }) => {
    const account = await nearApi.sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: id,
    });
    // see https://github.com/near/near-explorer/pull/841#discussion_r783205960
    if (account.code_hash === "11111111111111111111111111111111") {
      return null;
    }
    const [contractInfo, accessKeys] = await Promise.all([
      queryContractInfo(id),
      nearApi.sendJsonRpcQuery("view_access_key_list", {
        finality: "final",
        account_id: id,
      }),
    ]);
    const locked = accessKeys.keys.every(
      (key) => key.access_key.permission !== "FullAccess"
    );
    if (!contractInfo) {
      return {
        codeHash: account.code_hash,
        locked,
      };
    }
    return {
      codeHash: account.code_hash,
      transactionHash: contractInfo.hash,
      timestamp: parseInt(contractInfo.timestamp),
      locked,
    };
  },
});
