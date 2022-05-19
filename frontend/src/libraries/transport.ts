import { NetworkName } from "../types/common";
import { subscribeTopic, getLastValue, unsubscribeTopic } from "./pubsub";
import {
  ProcedureType,
  ProcedureArgs,
  ProcedureResult,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/common";
import { getConfig } from "./config";

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

export const fetchProcedure = async <P extends ProcedureType>(
  procedure: P,
  networkName: NetworkName,
  args: ProcedureArgs<P>
): Promise<ProcedureResult<P>> => {
  const {
    publicRuntimeConfig: { backendConfig },
  } = getConfig();
  const host = backendConfig.hosts[networkName];
  if (!host) {
    throw new Error(`Network ${networkName} is not supported on this host`);
  }
  const baseUrl = `${backendConfig.secure ? "https" : "http"}://${host}:${
    backendConfig.port
  }/`;
  const response = await fetch(
    baseUrl + procedure + `?network=${networkName}`,
    {
      method: "POST",
      body: JSON.stringify(args),
    }
  );
  const json = await response.json();
  return json as ProcedureResult<P>;
};

export const getFetcher = (networkName: NetworkName): Fetcher => (
  procedure,
  args
) => fetchProcedure(procedure, networkName, args);
