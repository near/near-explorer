const autobahn = require("autobahn");
const geoip = require("geoip-lite");

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
  nodeInfo.latitude = geo.ll[0];
  nodeInfo.longitude = geo.ll[1];
  nodeInfo.city = geo.city;
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

wampHandlers["nearcore-query"] = async ([path, data]) => {
  return await nearRpc.query(path, data);
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

const wampSqlSelectQueryCount = async (args, wamp) => {
  if (wamp) {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.select`;
    const res = await wamp.session.call(uri, args);
    return res[0];
  }
};

const wampSqlSelectQueryRows = async (args, wamp) => {
  if (wamp) {
    const uri = `com.nearprotocol.${wampNearNetworkName}.explorer.select`;
    return await wamp.session.call(uri, args);
  }
};

exports.setupWamp = setupWamp;
exports.wampPublish = wampPublish;
exports.wampSqlSelectQueryCount = wampSqlSelectQueryCount;
exports.wampSqlSelectQueryRows = wampSqlSelectQueryRows;
