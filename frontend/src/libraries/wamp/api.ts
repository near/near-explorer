import { NearNetwork } from "../config";
import { call } from "./call";
import * as connection from "./connection";
import {
  SubscriptionTopicType,
  SubscriptionTopicTypes,
  ProcedureType,
  ProcedureArgs,
  ProcedureResult,
} from "./types";

let subscriptions: Record<string, ((data: any) => void)[]> = {};

function subscribe<T extends SubscriptionTopicType>(
  nearNetwork: NearNetwork,
  topic: T,
  handler: (data: SubscriptionTopicTypes[T]) => void
): () => void {
  if (!subscriptions[topic]) {
    subscriptions[topic] = [];
  }
  subscriptions[topic].push(handler);
  void connection.subscribeTopic(topic, nearNetwork, (data) =>
    subscriptions[topic].forEach((handler) => handler(data))
  );
  const lastValue = connection.getLastValue(topic, nearNetwork);
  if (lastValue) {
    handler(lastValue);
  }
  return () => {
    subscriptions[topic] = subscriptions[topic].filter(
      (lookupHandler) => lookupHandler !== handler
    );
    void connection.unsubscribeTopic(topic, nearNetwork);
  };
}

export type WampCall = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>
) => Promise<ProcedureResult<P>>;

const getCall = (nearNetwork: NearNetwork): WampCall => (procedure, args) =>
  call(procedure, nearNetwork, args);

const wampApi = { subscribe, getCall };

export default wampApi;
