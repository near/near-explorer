import { z } from "zod";

import * as trpc from "@trpc/server";
import { KeysOfUnion, RPC } from "../types";

import * as stats from "../providers/stats";
import * as receipts from "../providers/receipts";
import * as transactions from "../providers/transactions";
import * as contracts from "../providers/contracts";
import * as blocks from "../providers/blocks";
import * as chunks from "../providers/chunks";
import * as accounts from "../providers/accounts";
import * as telemetry from "../providers/telemetry";

import * as nearApi from "../utils/near";
import { getBranch, getShortCommitSha } from "../common";
import { Context } from "../context";
import { formatDate } from "../utils/formatting";
import { config } from "../config";
import { validators } from "./validators";

export const router = trpc
  .router<Context>()
  .mutation("node-telemetry", {
    input: z.tuple([validators.telemetryRequest]),
    resolve: ({ input: [nodeInfo] }) => {
      return telemetry.sendTelemetry(nodeInfo);
    },
  })
  .query("nearcore-final-block", {
    resolve: () => {
      return nearApi.sendJsonRpc("block", { finality: "final" });
    },
  })
  .query("nearcore-status", {
    resolve: () => {
      return nearApi.sendJsonRpc("status", [null]);
    },
  })
  .query("get-latest-circulating-supply", {
    resolve: () => {
      return stats.getLatestCirculatingSupply();
    },
  })
  .query("transaction-history", {
    resolve: ({ ctx }) => {
      return ctx.state.transactionsCountHistoryForTwoWeeks.map(
        ({ date, total }) => ({
          date: formatDate(date),
          total,
        })
      );
    },
  })
  // stats part
  // transaction related
  .query("transactions-count-aggregated-by-date", {
    resolve: () => {
      return stats.getTransactionsByDate();
    },
  })
  .query("gas-used-aggregated-by-date", {
    resolve: () => {
      return stats.getGasUsedByDate();
    },
  })
  .query("deposit-amount-aggregated-by-date", {
    resolve: () => {
      return stats.getDepositAmountByDate();
    },
  })
  .query("transactions-list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: ({ input: { limit, cursor } }) => {
      return transactions.getTransactionsList(limit, cursor);
    },
  })
  .query("transactions-list-by-account-id", {
    input: z.strictObject({
      accountId: validators.accountId,
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: ({ input: { accountId, limit, cursor } }) => {
      return transactions.getAccountTransactionsList(accountId, limit, cursor);
    },
  })
  .query("transactions-list-by-block-hash", {
    input: z.strictObject({
      blockHash: validators.blockHash,
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: ({ input: { blockHash, limit, cursor } }) => {
      return transactions.getTransactionsListInBlock(blockHash, limit, cursor);
    },
  })
  .query("transaction-info", {
    input: z.tuple([validators.transactionHash]),
    resolve: async ({ input: [transactionHash] }) => {
      const transactionBaseInfo = await transactions.getTransactionInfo(
        transactionHash
      );
      if (!transactionBaseInfo) {
        return null;
      }
      const transactionInfo = await nearApi.sendJsonRpc(
        "EXPERIMENTAL_tx_status",
        [transactionBaseInfo.hash, transactionBaseInfo.signerId]
      );

      const actions = transactionInfo.transaction.actions.map(
        transactions.mapRpcActionToAction
      );
      const receipts = transactionInfo.receipts;
      const receiptsOutcome = transactionInfo.receipts_outcome;
      if (
        receipts.length === 0 ||
        receipts[0].receipt_id !== receiptsOutcome[0].id
      ) {
        receipts.unshift({
          predecessor_id: transactionInfo.transaction.signer_id,
          receipt: {
            Action: {
              signer_id: transactionInfo.transaction.signer_id,
              signer_public_key: "",
              gas_price: "0",
              output_data_receivers: [],
              input_data_ids: [],
              actions: transactionInfo.transaction.actions,
            },
          },
          receipt_id: receiptsOutcome[0].id,
          receiver_id: transactionInfo.transaction.receiver_id,
        });
      }
      const receiptOutcomesByIdMap = new Map<
        string,
        RPC.ExecutionOutcomeWithIdView
      >();
      receiptsOutcome.forEach((receipt) => {
        receiptOutcomesByIdMap.set(receipt.id, receipt);
      });

      const receiptsByIdMap = new Map<
        string,
        Omit<RPC.ReceiptView, "actions"> & { actions: transactions.Action[] }
      >();
      receipts.forEach((receiptItem) => {
        receiptsByIdMap.set(receiptItem.receipt_id, {
          ...receiptItem,
          actions:
            "Action" in receiptItem.receipt
              ? receiptItem.receipt.Action.actions.map(
                  transactions.mapRpcActionToAction
                )
              : [],
        });
      });

      return {
        ...transactionBaseInfo,
        status: Object.keys(
          transactionInfo.status
        )[0] as KeysOfUnion<RPC.FinalExecutionStatus>,
        actions,
        receiptsOutcome,
        receipt: transactions.collectNestedReceiptWithOutcome(
          receiptsOutcome[0].id,
          receiptsByIdMap,
          receiptOutcomesByIdMap
        ),
        transactionOutcome: transactionInfo.transaction_outcome,
      };
    },
  })
  .query("transaction-execution-status", {
    input: z.tuple([validators.transactionHash, validators.accountId]),
    resolve: async ({ input: [hash, signerId] }) => {
      const transaction = await nearApi.sendJsonRpc("EXPERIMENTAL_tx_status", [
        hash,
        signerId,
      ]);
      return Object.keys(
        transaction.status
      )[0] as KeysOfUnion<RPC.FinalExecutionStatus>;
    },
  })
  // accounts
  .query("new-accounts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getNewAccountsCountByDate();
    },
  })
  .query("live-accounts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getLiveAccountsCountByDate();
    },
  })
  .query("active-accounts-count-aggregated-by-week", {
    resolve: () => {
      return stats.getActiveAccountsCountByWeek();
    },
  })
  .query("active-accounts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getActiveAccountsCountByDate();
    },
  })
  .query("active-accounts-list", {
    resolve: () => {
      return stats.getActiveAccountsList();
    },
  })
  .query("is-account-indexed", {
    input: z.tuple([validators.accountId]),
    resolve: ({ input: [accountId] }) => {
      return accounts.isAccountIndexed(accountId);
    },
  })
  .query("accounts-list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.accountPagination.optional(),
    }),
    resolve: ({ input: { limit, cursor } }) => {
      return accounts.getAccountsList(limit, cursor);
    },
  })
  .query("account-transactions-count", {
    input: z.tuple([validators.accountId]),
    resolve: ({ input: [accountId] }) => {
      return accounts.getAccountTransactionsCount(accountId);
    },
  })
  .query("account-info", {
    input: z.tuple([validators.accountId]),
    resolve: async ({ input: [accountId] }) => {
      const [accountInfo, accountDetails] = await Promise.all([
        accounts.getAccountInfo(accountId),
        accounts.getAccountDetails(accountId),
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
  .query("account", {
    input: z.strictObject({
      accountId: validators.accountId,
    }),
    resolve: async ({ input: { accountId } }) => {
      const isAccountIndexed = await accounts.isAccountIndexed(accountId);
      if (!isAccountIndexed) {
        return null;
      }
      const [
        accountInfo,
        accountDetails,
        nearCoreAccount,
        transactionsCount,
      ] = await Promise.all([
        accounts.getAccountInfo(accountId),
        accounts.getAccountDetails(accountId),
        nearApi.sendJsonRpcQuery("view_account", {
          finality: "final",
          account_id: accountId,
        }),
        accounts.getAccountTransactionsCount(accountId),
      ]);
      if (!accountInfo || !accountDetails) {
        return null;
      }
      return {
        id: accountId,
        isContract:
          nearCoreAccount.code_hash !== "11111111111111111111111111111111",
        created: accountInfo.created,
        storageUsed: accountDetails.storageUsage,
        nonStakedBalance: accountDetails.nonStakedBalance,
        stakedBalance: accountDetails.stakedBalance,
        transactionsQuantity:
          transactionsCount.inTransactionsCount +
          transactionsCount.outTransactionsCount,
      };
    },
  })
  // blocks
  .query("blocks-list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.blockPagination.optional(),
    }),
    resolve: ({ input: { limit, cursor } }) => {
      return blocks.getBlocksList(limit, cursor);
    },
  })
  .query("block-info", {
    input: z.tuple([validators.blockId]),
    resolve: async ({ input: [blockId] }) => {
      const block = await blocks.getBlockInfo(blockId);
      if (!block) {
        return null;
      }
      const receiptsCount = await receipts.getReceiptsCountInBlock(block?.hash);
      const gasUsedInChunks = await chunks.getGasUsedInChunks(block?.hash);
      return {
        ...block,
        gasUsed: gasUsedInChunks || "0",
        receiptsCount: receiptsCount || 0,
      };
    },
  })
  .query("block-by-hash-or-id", {
    input: z.tuple([validators.blockId]),
    resolve: ({ input: [blockId] }) => {
      return blocks.getBlockByHashOrId(blockId);
    },
  })
  // contracts
  .query("new-contracts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getNewContractsCountByDate();
    },
  })
  .query("unique-deployed-contracts-count-aggregate-by-date", {
    resolve: () => {
      return stats.getUniqueDeployedContractsCountByDate();
    },
  })
  .query("active-contracts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getActiveContractsCountByDate();
    },
  })
  .query("active-contracts-list", {
    resolve: () => {
      return stats.getActiveContractsList();
    },
  })
  // genesis stats
  .query("nearcore-total-fee-count", {
    input: z.tuple([z.number().min(1).max(7)]),
    resolve: ({ input: [daysCount] }) => {
      return stats.getTotalFee(daysCount);
    },
  })
  .query("circulating-supply-stats", {
    resolve: () => {
      return stats.getCirculatingSupplyByDate();
    },
  })
  // receipts
  .query("transaction-hash-by-receipt-id", {
    input: z.tuple([validators.receiptId]),
    resolve: ({ input: [receiptId] }) => {
      return receipts.getReceiptInTransaction(receiptId);
    },
  })
  .query("included-receipts-list-by-block-hash", {
    input: z.tuple([validators.blockHash]),
    resolve: ({ input: [blockHash] }) => {
      return receipts.getIncludedReceiptsList(blockHash);
    },
  })
  .query("executed-receipts-list-by-block-hash", {
    input: z.tuple([validators.blockHash]),
    resolve: ({ input: [blockHash] }) => {
      return receipts.getExecutedReceiptsList(blockHash);
    },
  })
  // transactions
  .query("is-transaction-indexed", {
    input: z.tuple([validators.transactionHash]),
    resolve: ({ input: [transactionHash] }) => {
      return transactions.getIsTransactionIndexed(transactionHash);
    },
  })
  // contracts
  .query("contract-info", {
    input: z.tuple([validators.accountId]),
    resolve: async ({ input: [accountId] }) => {
      const account = await nearApi.sendJsonRpcQuery("view_account", {
        finality: "final",
        account_id: accountId,
      });
      // see https://github.com/near/near-explorer/pull/841#discussion_r783205960
      if (account.code_hash === "11111111111111111111111111111111") {
        return null;
      }
      const [contractInfo, accessKeys] = await Promise.all([
        contracts.getContractInfo(accountId),
        nearApi.sendJsonRpcQuery("view_access_key_list", {
          finality: "final",
          account_id: accountId,
        }),
      ]);
      const locked = accessKeys.keys.every(
        (key) => key.access_key.permission !== "FullAccess"
      );
      if (contractInfo === null) {
        return {
          codeHash: account.code_hash,
          locked,
        };
      }
      return {
        codeHash: account.code_hash,
        transactionHash: contractInfo.hash,
        timestamp: contractInfo.blockTimestamp,
        locked,
      };
    },
  })
  .query("deploy-info", {
    resolve: async () => {
      if (process.env.RENDER) {
        return {
          branch: process.env.RENDER_GIT_BRANCH || "unknown",
          commit: process.env.RENDER_GIT_COMMIT || "unknown",
          instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
          serviceId: process.env.RENDER_SERVICE_ID || "unknown",
          serviceName: process.env.RENDER_SERVICE_NAME || "unknown",
        };
      } else {
        const [branch, commit] = await Promise.all([
          getBranch(),
          getShortCommitSha(),
        ]);
        return {
          branch,
          commit,
          instanceId: "local",
          serviceId: "local",
          serviceName: `backend/${config.networkName}`,
        };
      }
    },
  });
