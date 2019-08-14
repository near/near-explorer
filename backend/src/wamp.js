const autobahn = require("autobahn");

const models = require("../models");

const wampHandlers = {};

wampHandlers["node-telemetry"] = async ([nodeInfo]) => {
  // TODO: verify signature
  return await models.Node.upsert({
    nodeId: nodeInfo.node_id,
    moniker: nodeInfo.account_id,
    accountId: nodeInfo.account_id,
    ipAddress: nodeInfo.ip_address,
    lastSeen: Date.now(),
    lastHeight: nodeInfo.latest_block_height
  });
};

wampHandlers["select"] = async ([query, replacements]) => {
  return await models.sequelizeReadOnly.query(query, {
    replacements,
    type: models.Sequelize.QueryTypes.SELECT
  });
};

function setupWamp() {
  const wamp = new autobahn.Connection({
    realm: "near-explorer",
    transports: [
      {
        url: process.env.WAMP_NEAR_EXPLORER_URL || "ws://localhost:8080/ws",
        type: "websocket"
      }
    ],
    authmethods: ["ticket"],
    authid: "near-explorer-backend",
    onchallenge: (session, method, extra) => {
      if (method === "ticket") {
        return process.env.WAMP_NEAR_EXPLORER_BACKEND_SECRET || "back";
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
      const uri = `com.nearprotocol.explorer.${name}`;
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
