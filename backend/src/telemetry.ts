import geoip from "geoip-lite";
import { TelemetryRequest } from "./client-types";
import { databases, withPool } from "./db";

type TableField = {
  name: string;
  type: string;
  modifier?: string;
};

const TELEMETRY_FIELDS: TableField[] = [
  {
    name: "ip_address",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "moniker",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "account_id",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "node_id",
    type: "VARCHAR(255)",
    modifier: "NOT NULL PRIMARY KEY",
  },
  {
    name: "last_seen",
    type: "TIMESTAMP WITH TIME ZONE",
    modifier: "NOT NULL",
  },
  {
    name: "last_height",
    type: "BIGINT",
    modifier: "NOT NULL",
  },
  {
    name: "agent_name",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "agent_version",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "agent_build",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "peer_count",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "is_validator",
    type: "BOOLEAN",
    modifier: "NOT NULL",
  },
  {
    name: "last_hash",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "signature",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "status",
    type: "VARCHAR(255)",
    modifier: "NOT NULL",
  },
  {
    name: "latitude",
    type: "NUMERIC(8, 6)",
  },
  {
    name: "longitude",
    type: "NUMERIC(9, 6)",
  },
  {
    name: "city",
    type: "VARCHAR(255)",
  },
];

export const TELEMETRY_CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS nodes (\n${TELEMETRY_FIELDS.map((field) =>
  [field.name, field.type, field.modifier].filter(Boolean).join(" ")
).join(",\n")}\n);`;

const sendTelemetry = async (nodeInfo: TelemetryRequest): Promise<void> => {
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

  if (!databases.telemetryBackendWriteOnlyPool) {
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
  await withPool(databases.telemetryBackendWriteOnlyPool, (client) => {
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
        city = EXCLUDED.city
    `,
      [
        nodeInfo.ip_address,
        // moniker has never been really used or implemented on nearcore side
        nodeInfo.chain.account_id || "",
        // accountId must be non-empty when the telemetry is submitted by validation nodes
        nodeInfo.chain.account_id || "",
        nodeInfo.chain.node_id,
        new Date().toISOString(),
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
};

export { sendTelemetry };
