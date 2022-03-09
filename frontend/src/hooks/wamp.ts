import * as React from "react";
import { useNetworkContext } from "./use-network-context";
import wampApi, { WampCall } from "../libraries/wamp/api";
import {
  ProcedureArgs,
  ProcedureResult,
  ProcedureType,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../libraries/wamp/types";

export const useWampCall = (): WampCall => {
  const { currentNetwork } = useNetworkContext();
  return React.useCallback(wampApi.getCall(currentNetwork), [currentNetwork]);
};

type Fetcher<T> = (wampCall: WampCall) => Promise<T | undefined>;

export const useWampQuery = <T>(fetcher: Fetcher<T>): T | undefined => {
  const [value, setValue] = React.useState<T>();
  const wampCall = useWampCall();
  const fetchValue = React.useCallback(
    async () => setValue(await fetcher(wampCall)),
    [setValue, fetcher, wampCall]
  );
  React.useEffect(() => {
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
  useWampQuery<ProcedureResult<P>>(
    React.useCallback((wampCall) => wampCall(procedure, args), args)
  );

export const useWampSubscription = <Topic extends SubscriptionTopicType>(
  topic: Topic,
  withDataSource?: boolean
): SubscriptionTopicTypes[Topic] | undefined => {
  const { currentNetwork } = useNetworkContext();
  const [value, setValue] = React.useState<
    SubscriptionTopicTypes[Topic] | undefined
  >();
  React.useEffect(
    () =>
      wampApi.subscribe<Topic>(currentNetwork, topic, setValue, withDataSource),
    [currentNetwork, topic, setValue, withDataSource]
  );
  return value;
};
