const autobahn = require("autobahn");
const BN = require("bn.js");
const geoip = require("geoip-lite");
const { sha256 } = require("js-sha256");

const models = require("../models");

const {
  wampNearNetworkName,
  wampNearExplorerUrl,
  wampNearExplorerBackendSecret,
} = require("./config");
const { nearRpc } = require("./near");

const wampHandlers = {};

wampHandlers["node-telemetry"] = async ([nodeInfo]) => {
  let geo = geoip.lookup(nodeInfo.ip_address);
  if (geo) {
    nodeInfo.latitude = geo.ll[0];
    nodeInfo.longitude = geo.ll[1];
    nodeInfo.city = geo.city;
  } else {
    console.warn("Node Telemetry failed to lookup geoIP for ", nodeInfo);
  }
  return saveNodeIntoDatabase(nodeInfo);
};

const saveNodeIntoDatabase = async (nodeInfo) => {
  if (!nodeInfo.hasOwnProperty("agent")) {
    // This seems to be an old format, and all our nodes should support the new
    // Telemetry format as of 2020-04-14, so we just ignore those old Telemetry
    // reports.
    return;
  }
  return await models.Node.upsert({
    ipAddress: nodeInfo.ip_address,
    latitude: nodeInfo.latitude,
    longitude: nodeInfo.longitude,
    city: nodeInfo.city,
    lastSeen: Date.now(),
    nodeId: nodeInfo.chain.node_id,
    moniker: nodeInfo.chain.account_id,
    accountId: nodeInfo.chain.account_id,
    lastHeight: nodeInfo.chain.latest_block_height,
    peerCount: nodeInfo.chain.num_peers,
    isValidator: nodeInfo.chain.is_validator,
    lastHash: nodeInfo.chain.latest_block_hash,
    signature: nodeInfo.signature || "",
    agentName: nodeInfo.agent.name,
    agentVersion: nodeInfo.agent.version,
    agentBuild: nodeInfo.agent.build,
    status: nodeInfo.chain.status,
  });
};

wampHandlers["select"] = async ([query, replacements]) => {
  return await models.sequelizeReadOnly.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT,
  });
};

wampHandlers["select-postgres"] = async ([query, replacements]) => {
  return await models.sequelizePostgres.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT,
  });
};

wampHandlers["nearcore-view-account"] = async ([accountId]) => {
  return await nearRpc.sendJsonRpc("query", {
    request_type: "view_account",
    finality: "final",
    account_id: accountId,
  });
};

wampHandlers["nearcore-view-access-key-list"] = async ([accountId]) => {
  return await nearRpc.sendJsonRpc("query", {
    request_type: "view_access_key_list",
    finality: "final",
    account_id: accountId,
  });
};

wampHandlers["nearcore-tx"] = async ([transactionHash, accountId]) => {
  return await nearRpc.sendJsonRpc("tx", [transactionHash, accountId]);
};

wampHandlers["nearcore-final-block"] = async () => {
  return await nearRpc.sendJsonRpc("block", { finality: "final" });
};

wampHandlers["nearcore-status"] = async () => {
  return await nearRpc.sendJsonRpc("status");
};

wampHandlers["nearcore-validators"] = async () => {
  return await nearRpc.sendJsonRpc("validators", [null]);
};

wampHandlers["get-account-details"] = async ([accountId]) => {
  function generateLockupAccountIdFromAccountId(accountId) {
    // copied from https://github.com/near/near-wallet/blob/f52a3b1a72b901d87ab2c9cee79770d697be2bd9/src/utils/wallet.js#L601
    return (
      sha256(Buffer.from(accountId)).substring(0, 40) +
      "." +
      nearLockupAccountIdSuffix
    );
  }

  const lockupAccountId = generateLockupAccountIdFromAccountId(accountId);

  const [accountInfo, lockupTotalBalance, genesisConfig] = await Promise.all([
    nearRpc.sendJsonRpc("query", {
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    }),
    nearRpc
      .callViewMethod(lockupAccountId, "get_balance", {})
      .then((balance) => new BN(balance)),
    nearRpc.sendJsonRpc("EXPERIMENTAL_genesis_config", {}),
  ]);

  const storageUsage = new BN(accountInfo.storage_usage);
  const storageAmountPerByte = new BN(
    config.runtime_config.storage_amount_per_byte
  );
  const stakedBalance = new BN(accountInfo.locked);
  const nonStakedBalance = new BN(accountInfo.amount);
  const minimumBalance = storageAmountPerByte.mul(storageUsage);
  const availableBalance = nonStakedBalance.sub(
    BN.max(stakedBalance, minimumBalance)
  );
  let totalBalance = stakedBalance.add(nonStakedBalance);
  if (lockupAccountInfo) {
    totalBalance = totalBalance.add(lockupAccountInfo.totalBalance);
  }

  return {
    storageUsage: storageUsage.toString(),
    stakedBalance: stakedBalance.toString(),
    nonStakedBalance: nonStakedBalance.toString(),
    minimumBalance: minimumBalance.toString(),
    availableBalance: availableBalance.toString(),
    totalBalance: totalBalance.toString(),
  };
};

function setupWamp() {
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
    onchallenge: (session, method, extra) => {
      if (method === "ticket") {
        return wampNearExplorerBackendSecret;
      }
      throw "WAMP authentication error: unsupported challenge method";
    },
    retry_if_unreachable: true,
    max_retries: Number.MAX_SAFE_INTEGER,
    max_retry_delay: 10,
  });

  wamp.onopen = async (session) => {
    console.log("WAMP connection is established. Waiting for commands...");

    for (const [name, handler] of Object.entries(wampHandlers)) {
      const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.${name}`;
      try {
        await session.register(uri, handler);
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
    console.log(
      "WAMP connection has been closed (check WAMP router availability and credentials):",
      reason
    );
  };

  return wamp;
}

const wampPublish = (topic, args, wamp) => {
  const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.${topic}`;
  wamp.session.publish(uri, args);
};

exports.setupWamp = setupWamp;
exports.wampPublish = wampPublish;
