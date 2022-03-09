import autobahn from "autobahn";
import BN from "bn.js";
import geoip from "geoip-lite";
import { sha256 } from "js-sha256";
import EventEmitter from "events";

import * as stats from "./stats";
import * as receipts from "./receipts";
import * as transactions from "./transactions";
import * as contracts from "./contracts";
import * as blocks from "./blocks";
import * as chunks from "./chunks";
import * as accounts from "./accounts";

import {
  AccountDetails,
  ProcedureTypes,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "./client-types";

import {
  wampNearNetworkName,
  wampNearExplorerUrl,
  wampNearExplorerBackendSecret,
  nearLockupAccountIdSuffix,
} from "./config";

import { callViewMethod, sendJsonRpc, sendJsonRpcQuery } from "./near";
import { databases, withPool } from "./db";

const wampHandlers: {
  [P in keyof ProcedureTypes]: (
    args: ProcedureTypes[P]["args"]
  ) => Promise<ProcedureTypes[P]["result"]>;
} = {
  "node-telemetry": async ([nodeInfo]) => {
    if (!nodeInfo.hasOwnProperty("agent")) {
      // This seems to be an old format, and all our nodes should support the new
      // Telemetry format as of 2020-04-14, so we just ignore those old Telemetry
      // reports.
      return;
    }

    // TODO update validators list ones per epoch

    // const stakingNodesList = await getStakingNodesList();
    // const stakingNode = stakingNodesList.get(nodeInfo.chain.account_id);
    // we want to validate "active" validators only
    // const isValidator = stakingNode?.stakingStatus === "active";

    if (!databases.telemetryBackendPool) {
      return;
    }

    // TODO: fix the signature verification. Given that the JSON payload is signed, it creates a challenge to serialize the same JSON string without `signature` field.
    /*
    if (isValidator) {
      const messageJSON = {
        agent: nodeInfo.agent,
        system: nodeInfo.system,
        chain: nodeInfo.chain,
      };
      const message = new TextEncoder().encode(messageJSON);
      const publicKey = utils.PublicKey.from(stakingNode.public_key);
      const isVerified = nacl.sign.detached.verify(
        message,
        utils.serialize.base_decode(
          telemetryInfo.signature.substring(8, telemetryInfo.signature.length)
        ),
        publicKey.data
      );
  
      if (!isVerified) {
        console.warn(
          "We ignore fake telemetry data about validation node: ",
          nodeInfo
        );
        return;
      }
    }
    */
    const geo = geoip.lookup(nodeInfo.ip_address);
    await withPool(databases.telemetryBackendPool, (client) => {
      return client.query(
        `
        INSERT INTO nodes (
          ip_address, moniker, account_id, node_id,
          last_seen, last_height, agent_name, agent_version,
          agent_build, peer_count, is_validator, last_hash,
          signature, status, latitude, longitude, city
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, $10, $11, $12,
          $13, $14, $15, $16, $17
        ) ON CONFLICT (node_id) DO UPDATE
        SET
          ip_address = EXCLUDED.ip_address,
          moniker = EXCLUDED.moniker,
          account_id = EXCLUDED.account_id,
          last_seen = EXCLUDED.last_seen,
          last_height = EXCLUDED.last_height,
          agent_name = EXCLUDED.agent_name,
          agent_version = EXCLUDED.agent_version,
          agent_build = EXCLUDED.agent_build,
          peer_count = EXCLUDED.peer_count,
          is_validator = EXCLUDED.is_validator,
          last_hash = EXCLUDED.last_hash,
          signature = EXCLUDED.signature,
          status = EXCLUDED.status,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          city = EXCLUDED.city,
      `,
        [
          nodeInfo.ip_address,
          // moniker has never been really used or implemented on nearcore side
          nodeInfo.chain.account_id || "",
          // accountId must be non-empty when the telemetry is submitted by validation nodes
          nodeInfo.chain.account_id || "",
          nodeInfo.chain.node_id,
          Date.now(),
          nodeInfo.chain.latest_block_height,
          nodeInfo.agent.name,
          nodeInfo.agent.version,
          nodeInfo.agent.build,
          nodeInfo.chain.num_peers,
          nodeInfo.chain.is_validator,
          nodeInfo.chain.latest_block_hash,
          nodeInfo.signature || "",
          nodeInfo.chain.status,
          geo ? geo.ll[0] : null,
          geo ? geo.ll[1] : null,
          geo ? geo.city : null,
        ]
      );
    });
  },

  // rpc endpoint
  "nearcore-view-account": async ([accountId]) => {
    return await sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: accountId,
    });
  },

  "nearcore-view-access-key-list": async ([accountId]) => {
    return await sendJsonRpcQuery("view_access_key_list", {
      finality: "final",
      account_id: accountId,
    });
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
  "nearcore-genesis-protocol-configuration": async ([blockId]) => {
    return await sendJsonRpc("block", { block_id: blockId });
  },

  "get-latest-circulating-supply": async () => {
    return await stats.getLatestCirculatingSupply();
  },

  "get-account-details": async ([accountId]) => {
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

    const accountDetails: AccountDetails = {
      storageUsage: storageUsage.toString(),
      stakedBalance: stakedBalance.toString(),
      nonStakedBalance: nonStakedBalance.toString(),
      minimumBalance: minimumBalance.toString(),
      availableBalance: availableBalance.toString(),
      totalBalance: "0",
    };

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
        let lockupTotalBalance = lockupStakedBalance.add(
          lockupNonStakedBalance
        );
        if (lockupDelegatedToStakingPoolBalance) {
          lockupTotalBalance.iadd(lockupDelegatedToStakingPoolBalance);
        }
        totalBalance.iadd(lockupTotalBalance);
        accountDetails.lockupAccountId = lockupAccountId;
        accountDetails.lockupTotalBalance = lockupTotalBalance.toString();
        accountDetails.lockupLockedBalance = lockupLockedBalance.toString();
        accountDetails.lockupUnlockedBalance = lockupTotalBalance
          .sub(lockupLockedBalance)
          .toString();
      }
      // It is a regular account without lockup
    }

    accountDetails.totalBalance = totalBalance.toString();

    return accountDetails;
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
    return await accounts.getAccountInfo(accountId);
  },

  "account-activity": async ([accountId]) => {
    return await accounts.getAccountActivity(accountId);
  },

  // blocks
  "first-produced-block-timestamp": async () => {
    return await stats.getFirstProducedBlockTimestamp();
  },
  "blocks-list": async ([limit, paginationIndexer]) => {
    return await blocks.getBlocksList(limit, paginationIndexer);
  },
  "block-info": async ([blockId]) => {
    return await blocks.getBlockInfo(blockId);
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

  // partner part
  "partner-total-transactions-count": async () => {
    return await stats.getPartnerTotalTransactionsCount();
  },

  "partner-first-3-month-transactions-count": async () => {
    return await stats.getPartnerFirst3MonthTransactionsCount();
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
  "receipts-count-in-block": async ([blockHash]) => {
    return await receipts.getReceiptsCountInBlock(blockHash);
  },
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
  "contract-info-by-account-id": async ([accountId]) => {
    return await contracts.getContractInfo(accountId);
  },

  // chunks
  "gas-used-in-chunks": async ([blockHash]) => {
    return await chunks.getGasUsedInChunks(blockHash);
  },
};

// set up wamp
function setupWamp(): () => Promise<autobahn.Session> {
  const wamp = new autobahn.Connection({
    realm: "near-explorer",
    transports: [
      {
        url: wampNearExplorerUrl,
        type: "websocket",
      },
    ],
    authmethods: ["ticket"],
    authid: "near-explorer-backend",
    onchallenge: (_session, method) => {
      if (method === "ticket") {
        return wampNearExplorerBackendSecret;
      }
      throw "WAMP authentication error: unsupported challenge method";
    },
    retry_if_unreachable: true,
    max_retries: Number.MAX_SAFE_INTEGER,
    max_retry_delay: 10,
  });

  let currentSessionPromise: Promise<autobahn.Session>;
  const openEventEmitter = new EventEmitter();

  wamp.onopen = async (session) => {
    openEventEmitter.emit("opened", session);
    currentSessionPromise = Promise.resolve(session);
    console.log("WAMP connection is established. Waiting for commands...");

    for (const [name, handler] of Object.entries(wampHandlers)) {
      const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.${name}`;
      try {
        await session.register(
          uri,
          (handler as unknown) as autobahn.RegisterEndpoint
        );
      } catch (error) {
        console.error(`Failed to register "${uri}" handler due to:`, error);
        wamp.close();
        setTimeout(() => {
          wamp.open();
        }, 1000);
        return;
      }
    }
  };

  wamp.onclose = (reason) => {
    currentSessionPromise = new Promise((resolve) => {
      openEventEmitter.addListener("opened", resolve);
    });
    console.log(
      "WAMP connection has been closed (check WAMP router availability and credentials):",
      reason
    );
    return false;
  };

  wamp.open();
  return () => currentSessionPromise;
}

const wampPublish = async <T extends SubscriptionTopicType>(
  topic: T,
  namedArgs: SubscriptionTopicTypes[T],
  getSession: () => Promise<autobahn.Session>
): Promise<void> => {
  const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.${topic}`;
  const session = await getSession();
  if (!session.isOpen) {
    console.log(`No session on stack\n${new Error().stack}`);
  }
  session.publish(uri, [], namedArgs);
};

export { setupWamp, wampPublish };
