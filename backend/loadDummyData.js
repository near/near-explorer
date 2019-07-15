if (process.env.NODE_ENV) {
  process.env.NODE_ENV += "-migration";
} else {
  process.env.NODE_ENV = "development-migration";
}

const models = require("./models");

async function init() {
  console.log("Initializing dummy accounts...");
  await models.Account.create({
    accountId: "alice.near",
    balance: "100000",
    stake: "100000",
    lastBlockIndex: "",
    bytes: "1337",
    code: ""
  });
  await models.Account.create({
    accountId: "bob.near",
    balance: "100000",
    stake: "100000",
    lastBlockIndex: "",
    bytes: "1337",
    code: ""
  });
  await models.Account.create({
    accountId: "vlad.near",
    balance: "100000",
    stake: "100000",
    lastBlockIndex: "",
    bytes: "1337",
    code: ""
  });
  await models.Account.create({
    accountId: "jake.near",
    balance: "100000",
    stake: "100000",
    lastBlockIndex: "",
    bytes: "1337",
    code: ""
  });
  await models.Account.create({
    accountId: "erik.near",
    balance: "100000",
    stake: "100000",
    lastBlockIndex: "",
    bytes: "1337",
    code: ""
  });
  await models.Account.create({
    accountId: "username.goes.here",
    balance: "100000",
    stake: "100000",
    lastBlockIndex: "",
    bytes: "1337",
    code: ""
  });

  console.log("Initializing dummy nodes...");
  await models.Node.create({
    ipAddress: "127.0.0.1",
    moniker: "",
    accountId: "alice.near",
    nodeId: "moon.near",
    lastSeen: "2019-01-01 00:00:00",
    lastHeight: "0"
  });
  await models.Node.create({
    ipAddress: "127.0.0.2",
    moniker: "",
    accountId: "alice.near",
    nodeId: "sun.near",
    lastSeen: "2019-01-01 00:00:00",
    lastHeight: "0"
  });
  await models.Node.create({
    ipAddress: "127.0.0.3",
    moniker: "",
    accountId: "bob.near",
    nodeId: "private.bob",
    lastSeen: "2019-01-01 00:00:00",
    lastHeight: "0"
  });

  console.log("Initializing dummy blocks...");
  await models.Block.create({
    hash: "69a3a6811111193",
    prevHash: "",
    height: 6066093,
    timestamp: "2019-01-19 00:00:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });
  await models.Block.create({
    hash: "69a3a6811111194",
    prevHash: "",
    height: 6066094,
    timestamp: "2019-01-19 00:01:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });

  await models.Block.create({
    hash: "69a3a6811111195",
    prevHash: "",
    height: 6066095,
    timestamp: "2019-01-19 00:02:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });

  await models.Block.create({
    hash: "69a3a6811111196",
    prevHash: "",
    height: 6066096,
    timestamp: "2019-01-19 00:03:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });

  await models.Block.create({
    hash: "69a3a6811111197",
    prevHash: "",
    height: 6066097,
    timestamp: "2019-01-19 00:04:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });

  await models.Block.create({
    hash: "69a3a6811111198",
    prevHash: "",
    height: 6066098,
    timestamp: "2019-01-19 00:05:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });
  await models.Block.create({
    hash: "69a3a6811111199",
    prevHash: "",
    height: 6066099,
    timestamp: "2019-01-19 00:06:00",
    weight: "1",
    authorId: "vlad.near",
    listOfApprovals: ""
  });

  console.log("Initializing dummy chunks...");
  await models.Chunk.create({
    hash: "69a3a6811111193",
    blockHash: "69a3a6811111193",
    shardId: "shard1",
    authorId: "alice.near"
  });
  await models.Chunk.create({
    hash: "69a3a6811111194",
    blockHash: "69a3a6811111194",
    shardId: "shard1",
    authorId: "alice.near"
  });
  await models.Chunk.create({
    hash: "69a3a6811111195",
    blockHash: "69a3a6811111195",
    shardId: "shard1",
    authorId: "alice.near"
  });
  await models.Chunk.create({
    hash: "69a3a6811111196",
    blockHash: "69a3a6811111196",
    shardId: "shard1",
    authorId: "alice.near"
  });
  await models.Chunk.create({
    hash: "69a3a6811111197",
    blockHash: "69a3a6811111197",
    shardId: "shard1",
    authorId: "alice.near"
  });
  await models.Chunk.create({
    hash: "69a3a6811111198",
    blockHash: "69a3a6811111198",
    shardId: "shard1",
    authorId: "alice.near"
  });
  await models.Chunk.create({
    hash: "69a3a6811111199",
    blockHash: "69a3a6811111199",
    shardId: "shard1",
    authorId: "alice.near"
  });

  console.log("Initializing dummy transactions...");
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb1111",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "bob.near",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb2222",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "DeployContract",
    args: { name: "NameOfContract" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb3333",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "Staked",
    args: { tokens: "10" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb4444",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "bob.near",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb5555",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "bob.near",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb6666",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "DeployContract",
    args: { name: "NameOfContract" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb7777",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "Staked",
    args: { tokens: "10" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb8888",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "bob.near",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehb9999",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "bob.near",
    kind: "Sent",
    args: { to: "jake.near", tokens: "15" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehc0000",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "bob.near",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehc1111",
    parentHash: null,
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "CreateAccount",
    args: { name: "erik.near" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehc2222",
    parentHash: "TMuA6YqfCeX8Ehc1111",
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehc3333",
    parentHash: "TMuA6YqfCeX8Ehc1111",
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehc4444",
    parentHash: "TMuA6YqfCeX8Ehc3333",
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "Call",
    args: { name: "NameOfContract", to: "bob.near", tokens: "1000" },
    status: "Completed",
    logs: ""
  });
  await models.Transaction.create({
    hash: "TMuA6YqfCeX8Ehc5555",
    parentHash: "TMuA6YqfCeX8Ehc3333",
    chunkHash: "69a3a6811111199",
    originator: "username.goes.here",
    destination: "",
    kind: "Receipt",
    args: { name: "NameOfContract" },
    status: "Completed",
    logs: ""
  });
}

init();
