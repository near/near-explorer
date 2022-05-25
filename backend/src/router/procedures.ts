import { exec } from "child_process";
import { promisify } from "util";

import { Action, KeysOfUnion, ProcedureTypes, RPC } from "../types";

import * as stats from "../providers/stats";
import * as receipts from "../providers/receipts";
import * as transactions from "../providers/transactions";
import * as contracts from "../providers/contracts";
import * as blocks from "../providers/blocks";
import * as chunks from "../providers/chunks";
import * as accounts from "../providers/accounts";
import * as telemetry from "../providers/telemetry";

import * as nearApi from "../utils/near";
import { GlobalState } from "../global-state";
import { formatDate } from "../utils/formatting";
import { config } from "../config";

const promisifiedExec = promisify(exec);

export type ProcedureHandlers = {
  [P in keyof ProcedureTypes]: (
    args: ProcedureTypes[P]["args"],
    state: GlobalState
  ) => Promise<ProcedureTypes[P]["result"]>;
};

export const procedureHandlers: ProcedureHandlers = {
  "node-telemetry": async ([nodeInfo]) => {
    return telemetry.sendTelemetry(nodeInfo);
  },

  "nearcore-final-block": async () => {
    return await nearApi.sendJsonRpc("block", { finality: "final" });
  },

  "nearcore-status": async () => {
    return await nearApi.sendJsonRpc("status", [null]);
  },

  // genesis configuration
  "nearcore-genesis-protocol-configuration": async () => {
    const networkProtocolConfig = await nearApi.sendJsonRpc(
      "EXPERIMENTAL_protocol_config",
      { finality: "final" }
    );
    return await nearApi.sendJsonRpc("block", {
      block_id: networkProtocolConfig.genesis_height,
    });
  },

  "get-latest-circulating-supply": async () => {
    return await stats.getLatestCirculatingSupply();
  },

  "transaction-history": async (_, state) => {
    return state.transactionsCountHistoryForTwoWeeks.map(({ date, total }) => ({
      date: formatDate(date),
      total,
    }));
  },

  // stats part
  // transaction related
  "transactions-count-aggregated-by-date": async () => {
    return await stats.getTransactionsByDate();
  },

  "gas-used-aggregated-by-date": async () => {
    return await stats.getGasUsedByDate();
  },

  "deposit-amount-aggregated-by-date": async () => {
    return await stats.getDepositAmountByDate();
  },

  "transactions-list": async ([limit, paginationIndexer]) => {
    return await transactions.getTransactionsList(limit, paginationIndexer);
  },

  "transactions-list-by-account-id": async ([
    accountId,
    limit,
    paginationIndexer,
  ]) => {
    return await transactions.getAccountTransactionsList(
      accountId,
      limit,
      paginationIndexer
    );
  },

  "transactions-list-by-block-hash": async ([
    blockHash,
    limit,
    paginationIndexer,
  ]) => {
    return await transactions.getTransactionsListInBlock(
      blockHash,
      limit,
      paginationIndexer
    );
  },

  "transaction-info": async ([transactionHash]) => {
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
      Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
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

  "transaction-execution-status": async ([hash, signerId]) => {
    const transaction = await nearApi.sendJsonRpc("EXPERIMENTAL_tx_status", [
      hash,
      signerId,
    ]);
    return Object.keys(
      transaction.status
    )[0] as KeysOfUnion<RPC.FinalExecutionStatus>;
  },

  // accounts
  "new-accounts-count-aggregated-by-date": async () => {
    return await stats.getNewAccountsCountByDate();
  },

  "live-accounts-count-aggregated-by-date": async () => {
    return await stats.getLiveAccountsCountByDate();
  },

  "active-accounts-count-aggregated-by-week": async () => {
    return await stats.getActiveAccountsCountByWeek();
  },

  "active-accounts-count-aggregated-by-date": async () => {
    return await stats.getActiveAccountsCountByDate();
  },

  "active-accounts-list": async () => {
    return await stats.getActiveAccountsList();
  },

  "is-account-indexed": async ([accountId]) => {
    return await accounts.isAccountIndexed(accountId);
  },

  "accounts-list": async ([limit, paginationIndexer]) => {
    return await accounts.getAccountsList(limit, paginationIndexer);
  },

  "account-transactions-count": async ([accountId]) => {
    return await accounts.getAccountTransactionsCount(accountId);
  },

  "account-info": async ([accountId]) => {
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

  // blocks
  "first-produced-block-timestamp": async () => {
    return await stats.getFirstProducedBlockTimestamp();
  },
  "blocks-list": async ([limit, paginationIndexer]) => {
    return await blocks.getBlocksList(limit, paginationIndexer);
  },
  "block-info": async ([blockId]) => {
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
  "block-by-hash-or-id": async ([blockId]) => {
    return await blocks.getBlockByHashOrId(blockId);
  },

  // contracts
  "new-contracts-count-aggregated-by-date": async () => {
    return await stats.getNewContractsCountByDate();
  },

  "unique-deployed-contracts-count-aggregate-by-date": async () => {
    return await stats.getUniqueDeployedContractsCountByDate();
  },

  "active-contracts-count-aggregated-by-date": async () => {
    return await stats.getActiveContractsCountByDate();
  },

  "active-contracts-list": async () => {
    return await stats.getActiveContractsList();
  },

  // genesis stats
  "nearcore-genesis-accounts-count": async () => {
    return await stats.getGenesisAccountsCount();
  },

  "nearcore-total-fee-count": async ([daysCount]) => {
    return await stats.getTotalFee(daysCount);
  },

  "circulating-supply-stats": async () => {
    return await stats.getCirculatingSupplyByDate();
  },

  // receipts
  "transaction-hash-by-receipt-id": async ([receiptId]) => {
    return await receipts.getReceiptInTransaction(receiptId);
  },
  "included-receipts-list-by-block-hash": async ([blockHash]) => {
    return await receipts.getIncludedReceiptsList(blockHash);
  },
  "executed-receipts-list-by-block-hash": async ([blockHash]) => {
    return await receipts.getExecutedReceiptsList(blockHash);
  },

  // transactions
  "is-transaction-indexed": async ([transactionHash]) => {
    return await transactions.getIsTransactionIndexed(transactionHash);
  },

  // contracts
  "contract-info": async ([accountId]) => {
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

  "deploy-info": async () => {
    if (process.env.RENDER) {
      return {
        branch: process.env.RENDER_GIT_BRANCH || "unknown",
        commit: process.env.RENDER_GIT_COMMIT || "unknown",
        instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
        serviceId: process.env.RENDER_SERVICE_ID || "unknown",
        serviceName: process.env.RENDER_SERVICE_NAME || "unknown",
      };
    } else {
      const [{ stdout: branch }, { stdout: commit }] = await Promise.all([
        promisifiedExec("git branch --show-current"),
        promisifiedExec("git rev-parse --short HEAD"),
      ]);
      return {
        branch: branch.trim(),
        commit: commit.trim(),
        instanceId: "local",
        serviceId: "local",
        serviceName: `backend/${config.networkName}`,
      };
    }
  },
};
