import geoip from "geoip-lite";
import { TelemetryRequest } from "./types";
import { maybeCreateTelemetryTable, maybeSendTelemetry } from "./db-utils";

// Skip initializing Telemetry database if the backend is not configured to
// save telemety data (it is absolutely fine for local development)
export const setup = async () => {
  await maybeCreateTelemetryTable();
};

export const sendTelemetry = async (
  nodeInfo: TelemetryRequest
): Promise<any> => {
  if (!nodeInfo.hasOwnProperty("agent")) {
    // This seems to be an old format, and all our nodes should support the new
    // Telemetry format as of 2020-04-14, so we just ignore those old Telemetry
    // reports.
    return {};
  }

  // TODO update validators list ones per epoch

  // const stakingNodesList = await getStakingNodesList();
  // const stakingNode = stakingNodesList.get(nodeInfo.chain.account_id);
  // we want to validate "active" validators only
  // const isValidator = stakingNode?.stakingStatus === "active";

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
  const geoStart = Date.now();
  const geo = geoip.lookup(nodeInfo.ip_address);
  const geoEnd = Date.now();
  const timing = await maybeSendTelemetry(nodeInfo, geo);
  return {
    geo: { start: geoStart, end: geoEnd },
    ...timing,
  };
};
