import { NetworkName } from "../types/common";
import { subscribeTopic, getLastValue, unsubscribeTopic, fetch } from "./wamp";
import {
  ProcedureType,
  ProcedureArgs,
  ProcedureResult,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/common";

let subscriptions: Record<string, ((data: any) => void)[]> = {};

export const subscribe = <T extends SubscriptionTopicType>(
  networkName: NetworkName,
  topic: T,
  handler: (data: SubscriptionTopicTypes[T]) => void
): (() => void) => {
  if (!subscriptions[topic]) {
    subscriptions[topic] = [];
  }
  subscriptions[topic].push(handler);
  void subscribeTopic(topic, networkName, (data) =>
    subscriptions[topic].forEach((handler) => handler(data))
  );
  const lastValue = getLastValue(topic, networkName);
  if (lastValue) {
    handler(lastValue);
  }
  return () => {
    subscriptions[topic] = subscriptions[topic].filter(
      (lookupHandler) => lookupHandler !== handler
    );
    void unsubscribeTopic(topic, networkName);
  };
};

export type Fetcher = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>
) => Promise<ProcedureResult<P>>;

export const getFetcher = (networkName: NetworkName): Fetcher => (
  procedure,
  args
) => fetch(procedure, networkName, args);
