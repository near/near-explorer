const autobahn = require("autobahn");

const models = require("../models");

const {
  wampNearNetworkName,
  wampNearExplorerUrl,
  wampNearExplorerBackendSecret
} = require("./config");
const { nearRpc } = require("./near");

const wampHandlers = {};

wampHandlers["node-telemetry"] = async ([nodeInfo]) => {
  if (nodeInfo.hasOwnProperty("agent")) {
    return await models.Node.upsert({
      ipAddress: nodeInfo.ip_address,
      lastSeen: Date.now(),
      nodeId: nodeInfo.chain.node_id,
      moniker: nodeInfo.chain.account_id,
      accountId: nodeInfo.chain.account_id,
      lastHeight: nodeInfo.chain.latest_block_height,
      peerCount: nodeInfo.chain.num_peers,
      isValidator: nodeInfo.chain.is_validator,
      lastHash: nodeInfo.chain.lastest_block_hash,
      signature: nodeInfo.signature,
      agentName: nodeInfo.agent.name,
      agentVersion: nodeInfo.agent.version,
      agentBuild: nodeInfo.agent.build
    });
  }
  return await models.Node.upsert({
    ipAddress: nodeInfo.ip_address,
    lastSeen: Date.now(),
    nodeId: nodeInfo.node_id,
    moniker: nodeInfo.account_id,
    accountId: nodeInfo.account_id,
    lastHeight: nodeInfo.latest_block_height,
    peerCount: null,
    isValidator: null,
    lastHash: null,
    signature: null,
    agentName: null,
    agentVersion: null,
    agentBuild: null
  });
};

wampHandlers["select"] = async ([query, replacements]) => {
  return await models.sequelizeReadOnly.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT
  });
};

wampHandlers["nearcore-query"] = async ([path, data]) => {
  return await nearRpc.query(path, data);
};

wampHandlers["nearcore-tx"] = async ([transactionHash, accountId]) => {
  return await nearRpc.sendJsonRpc("tx", [transactionHash, accountId]);
};

wampHandlers["nearcore-EXPERIMENTAL_genesis_records"] = async ([pagination]) => {
  const genesisRecords =  await nearRpc.sendJsonRpc("EXPERIMENTAL_genesis_records", [pagination])
  return genesisRecords.records
}

wampHandlers["nearcore-EXPERIMENTAL_genesis_config"] = async () => {
  // genesisTime = genesisConfig.genesis_time
  return await nearRpc.sendJsonRpc("EXPERIMENTAL_genesis_config")
}

function setupWamp() {
  const wamp = new autobahn.Connection({
    realm: "near-explorer",
    transports: [
      {
        url: wampNearExplorerUrl,
        type: "websocket"
      }
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
    max_retry_delay: 10
  });

  wamp.onopen = async session => {
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

  wamp.onclose = reason => {
    console.log(
      "WAMP connection has been closed (check WAMP router availability and credentials):",
      reason
    );
  };

  return wamp;
}

exports.setupWamp = setupWamp;
