import { SubscriptionTopicType, NetworkName } from "./types";

// That's unfair as we actually change topic name
// But the types match so we'll keep it
export const wrapTopic = <T extends SubscriptionTopicType>(
  networkName: NetworkName,
  topic: T
): T => (`${networkName}.${topic}` as unknown) as T;
