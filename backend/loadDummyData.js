if (process.env.NODE_ENV) {
  process.env.NODE_ENV += "-migration";
} else {
  process.env.NODE_ENV = "development-migration";
}

const models = require("./models");

async function init() {
  console.log("Initializing dummy nodes...");
  await models.Node.create({
    ipAddress: "127.0.0.1",
    moniker: "",
    accountId: "1",
    nodeId: "1",
    lastSeen: "2019-01-01",
    lastHeight: "0"
  });
  await models.Node.create({
    ipAddress: "127.0.0.2",
    moniker: "",
    accountId: "2",
    nodeId: "2",
    lastSeen: "2019-01-01",
    lastHeight: "0"
  });
  await models.Node.create({
    ipAddress: "127.0.0.3",
    moniker: "",
    accountId: "3",
    nodeId: "3",
    lastSeen: "2019-01-01",
    lastHeight: "0"
  });

  console.log("Initializing dummy transactions...");
  await models.Transaction.create({
    hash: "11111111",
    originator: "frol.near",
    destination: "robin.near",
    kind: "FunctionCall"
  });
  await models.Transaction.create({
    hash: "22222222",
    originator: "frol.near",
    destination: "robin.near",
    kind: "SendMoney"
  });
  await models.Transaction.create({
    hash: "33333333",
    originator: "robin.near",
    destination: "bob.near",
    kind: "Receipt"
  });

  console.log("Initializing dummy blocks...");
  await models.Block.create({
    hash: [01, 01, 01, 01, 01, 01, 01, 01],
    prevHash: "",
    height: "1",
    timestamp: "2019-01-19",
    weight: "1",
    authorPk: "123",
    listOfApprovals: '["frol.near"]'
  });
  await models.Block.create({
    hash: [0xff, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02],
    prevHash: [0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01],
    height: "2",
    timestamp: "2019-01-19",
    weight: "2",
    authorPk: "123",
    listOfApprovals: '["robin.near"]'
  });
  await models.Block.create({
    hash: [0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03],
    prevHash: [0xff, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02],
    height: "3",
    timestamp: "2019-01-19",
    weight: "3",
    authorPk: "123",
    listOfApprovals: '["frol.near"]'
  });
  await models.Block.create({
    hash: [0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
    prevHash: [0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03],
    height: "4",
    timestamp: "2019-01-19",
    weight: "4",
    authorPk: "123",
    listOfApprovals: '["robin.near"]'
  });
}

init();
