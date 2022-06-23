import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as accounts from "../providers/accounts";
import * as contracts from "../providers/contracts";
import * as nearApi from "../utils/near";
import { validators } from "./validators";

export const router = trpc.router<Context>().query("contract-info", {
  input: z.tuple([validators.accountId]),
  resolve: async ({ input: [accountId] }) => {
    const account = await nearApi.sendJsonRpcQuery("view_account", {
      finality: "final",
      account_id: accountId,
    });
    // see https://github.com/near/near-explorer/pull/841#discussion_r783205960
    if (account.code_hash === "11111111111111111111111111111111") {
      return null;
    }
    const [contractInfo, accessKeys] = await Promise.all([
      contracts.getContractInfo(accountId),
      nearApi.sendJsonRpcQuery("view_access_key_list", {
        finality: "final",
        account_id: accountId,
      }),
    ]);
    const locked = accessKeys.keys.every(
      (key) => key.access_key.permission !== "FullAccess"
    );
    if (contractInfo === null) {
      return {
        codeHash: account.code_hash,
        locked,
      };
    }
    return {
      codeHash: account.code_hash,
      transactionHash: contractInfo.hash,
      timestamp: contractInfo.blockTimestamp,
      locked,
    };
  },
});
