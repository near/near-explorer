import { useState, useCallback, useEffect } from "react";
import { useNetworkContext } from "./use-network-context";
import wampApi, { WampCall } from "../libraries/wamp/api";
import {
  ProcedureArgs,
  ProcedureType,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../libraries/wamp/types";

export const useWampCall = (): WampCall => {
  const { currentNetwork } = useNetworkContext();
  return useCallback(wampApi.getCall(currentNetwork), [currentNetwork]);
};

type Fetcher<T> = (wampCall: WampCall) => Promise<T | undefined>;

export const useWampQuery = <T>(fetcher: Fetcher<T>): T | undefined => {
  const [value, setValue] = useState<T>();
  const wampCall = useWampCall();
  const fetchValue = useCallback(
    async () => setValue(await fetcher(wampCall)),
    [setValue, fetcher, wampCall]
  );
  useEffect(() => {
    void fetchValue().catch((error) => {
      console.error(new Error("WAMP call fail").stack);
      console.error(error);
    });
  }, [fetchValue]);
  return value;
};

export const useWampSimpleQuery = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>
) =>
  useWampQuery(useCallback((wampCall) => wampCall<P>(procedure, args), args));

export const useWampSubscription = <Topic extends SubscriptionTopicType>(
  topic: Topic
): SubscriptionTopicTypes[Topic] | undefined => {
  const { currentNetwork } = useNetworkContext();
  const [value, setValue] = useState<
    SubscriptionTopicTypes[Topic] | undefined
  >();
  useEffect(() => wampApi.subscribe<Topic>(currentNetwork, topic, setValue), [
    currentNetwork,
    topic,
    setValue,
  ]);
  return value;
};
