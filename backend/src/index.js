const autobahn = require("autobahn");

const models = require("../models");

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
  }
});

async function main() {
  wamp.onopen = async session => {
    console.log("WAMP connection is established. Waiting for commands...");
    await session.register(
      "com.nearprotocol.explorer.select",
      async ([query, replacements]) => {
        return await models.sequelizeReadOnly.query(query, {
          replacements,
          type: models.Sequelize.QueryTypes.SELECT
        });
      }
    );

    // This is an example of sending an event
    /*
    let counter = 0;
    setInterval(async () => {
      await session.publish("com.nearprotocol.explorer.oncounter", [counter]);
      console.log("published to 'oncounter' with counter " + counter);
      counter += 1;
    }, 1000);
    */
  };

  wamp.onclose = reason => {
    console.log(
      "WAMP connection has been closed (check WAMP router availability and credentials):",
      reason
    );
  };

  console.log("Starting WAMP connection...");
  wamp.open();
}

main();
