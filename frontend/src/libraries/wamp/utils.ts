import { NetworkName } from "../wamp/types";
import { SubscriptionTopicType } from "./types";

// That's unfair as we actually change topic name
// But the types match so we'll keep it
export const wrapTopic = <T extends SubscriptionTopicType>(
  topic: T,
  networkName: NetworkName
): T => {
  return (`${networkName}.${topic}` as unknown) as T;
};
