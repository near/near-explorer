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

export const useWampSimpleQuery = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>,
  disabled?: boolean
) => {
  const [value, setValue] = React.useState<ProcedureResult<P>>();
  const wampCall = useWampCall();
  const fetchValue = React.useCallback(
    async () => setValue(await wampCall(procedure, args)),
    [setValue, procedure, wampCall, ...args]
  );
  React.useEffect(() => {
    if (disabled) {
      return;
    }
    void fetchValue().catch((error) => {
      console.error(new Error("WAMP call fail").stack);
      console.error(error);
    });
  }, [fetchValue, disabled]);
  return value;
};

export const useWampSubscription = <Topic extends SubscriptionTopicType>(
  topic: Topic
): SubscriptionTopicTypes[Topic] | undefined => {
  const { currentNetwork } = useNetworkContext();
  const [value, setValue] = React.useState<
    SubscriptionTopicTypes[Topic] | undefined
  >();
  React.useEffect(
    () => wampApi.subscribe<Topic>(currentNetwork, topic, setValue),
    [currentNetwork, topic, setValue]
  );
  return value;
};
