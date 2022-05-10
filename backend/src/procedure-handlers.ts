import { exec } from "child_process";
import { promisify } from "util";

import { KeysOfUnion, ProcedureTypes } from "./client-types";
import * as RPC from "./rpc-types";

import * as stats from "./stats";
import * as receipts from "./receipts";
import * as transactions from "./transactions";
import * as contracts from "./contracts";
import * as blocks from "./blocks";
import * as chunks from "./chunks";
import * as accounts from "./accounts";
import * as telemetry from "./telemetry";

import { sendJsonRpc, sendJsonRpcQuery } from "./near";
import { GlobalState } from "./checks";
import { formatDate } from "./utils";
import { config } from "./config";

const promisifiedExec = promisify(exec);

export const procedureHandlers: {
  [P in keyof ProcedureTypes]: (
    args: ProcedureTypes[P]["args"],
    state: GlobalState
  ) => Promise<ProcedureTypes[P]["result"]>;
} = {
  "node-telemetry": async ([nodeInfo]) => {
    return await telemetry.sendTelemetry(nodeInfo);
  },

  "nearcore-tx": async ([transactionHash, accountId]) => {
    return await sendJsonRpc("EXPERIMENTAL_tx_status", [
      transactionHash,
      accountId,
    ]);
  },

  "nearcore-final-block": async () => {
    return await sendJsonRpc("block", { finality: "final" });
  },

  "nearcore-status": async () => {
    return await sendJsonRpc("status", [null]);
  },

  // genesis configuration
  "nearcore-genesis-protocol-configuration": async () => {
    const networkProtocolConfig = await sendJsonRpc(
      "EXPERIMENTAL_protocol_config",
      { finality: "final" }
    );
    return await sendJsonRpc("block", {
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
    return await transactions.getTransactionInfo(transactionHash);
  },

  "transaction-execution-status": async ([hash, signerId]) => {
    const transaction = await sendJsonRpc("EXPERIMENTAL_tx_status", [
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
    if (!accountDetails || !accountInfo) {
      return null;
    }
    return {
      ...accountInfo,
      ...accountDetails,
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
    const account = await sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: accountId,
    });
    // see https://github.com/near/near-explorer/pull/841#discussion_r783205960
    if (account.code_hash === "11111111111111111111111111111111") {
      return null;
    }
    const [contractInfo, accessKeys] = await Promise.all([
      contracts.getContractInfo(accountId),
      sendJsonRpcQuery("view_access_key_list", {
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
