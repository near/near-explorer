import { NearNetwork } from "./config";
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
  nearNetwork: NearNetwork,
  topic: T,
  handler: (data: SubscriptionTopicTypes[T]) => void
): (() => void) => {
  if (!subscriptions[topic]) {
    subscriptions[topic] = [];
  }
  subscriptions[topic].push(handler);
  void subscribeTopic(topic, nearNetwork, (data) =>
    subscriptions[topic].forEach((handler) => handler(data))
  );
  const lastValue = getLastValue(topic, nearNetwork);
  if (lastValue) {
    handler(lastValue);
  }
  return () => {
    subscriptions[topic] = subscriptions[topic].filter(
      (lookupHandler) => lookupHandler !== handler
    );
    void unsubscribeTopic(topic, nearNetwork);
  };
};

export type Fetcher = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>
) => Promise<ProcedureResult<P>>;

export const getFetcher = (nearNetwork: NearNetwork): Fetcher => (
  procedure,
  args
) => fetch(procedure, nearNetwork, args);
