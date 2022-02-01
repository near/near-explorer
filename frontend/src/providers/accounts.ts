import { WampCall } from "../libraries/wamp/api";
import { AccountBasicInfo, AccountDetails } from "../libraries/wamp/types";

export type Account = AccountBasicInfo & AccountDetails;

export const getAccount = async (wampCall: WampCall, accountId: string) => {
  const [accountBasic, accountInfo] = await Promise.all([
    wampCall("account-info", [accountId]),
    wampCall("get-account-details", [accountId]),
  ]);
  return {
    ...accountBasic,
    ...accountInfo,
  };
};
