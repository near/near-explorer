import { SubscriptionTopicType, ProcedureType, NetworkName } from "./types";

export const wrapTopic = <T extends SubscriptionTopicType>(
  networkName: NetworkName,
  topic: T
): T => {
  // That's unfair as we actually change topic name
  // But the types match so we'll keep it
  return (`com.nearprotocol.${networkName}.explorer.${topic}` as unknown) as T;
};

export const wrapProcedure = <T extends ProcedureType>(
  networkName: NetworkName,
  procedure: T
): T => {
  // That's unfair as we actually change procedure name
  // But the types match so we'll keep it
  return (`com.nearprotocol.${networkName}.explorer.${procedure}` as unknown) as T;
};
