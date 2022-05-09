import * as React from "react";
import { YoctoNEAR } from "../../../types/nominal";
import { Action } from "../../../types/procedures";

import AccountActivityBadge from "../../beta/accounts/AccountActivityBadge";

interface Props<A extends Action> {
  actions: {
    kind: A["kind"];
  }[];
  signerId: string;
}

const TransactionType: React.FC<Props<Action>> = React.memo(
  ({ actions, signerId }) => {
    const getActionMapping = (actions: Action[], isRefund: boolean): any => {
      if (actions.length === 0) {
        throw new Error("Unexpected zero-length array of actions");
      }
      if (actions.length !== 1) {
        return {
          type: "batch",
          actions: actions.map((action) =>
            getActionMapping([action], isRefund)
          ),
        };
      }
      switch (actions[0].kind) {
        case "AddKey":
          return {
            type: "access-key-created",
          };
        case "CreateAccount":
          return {
            type: "account-created",
          };
        case "DeleteAccount":
          return {
            type: "account-removed",
          };
        case "DeleteKey":
          return {
            type: "access-key-removed",
          };
        case "DeployContract":
          return {
            type: "contract-deployed",
          };
        case "FunctionCall":
          return {
            type: "call-method",
            methodName: actions[0].args.method_name,
          };
        case "Stake":
          return {
            type: "restake",
          };
        case "Transfer":
          return {
            type: isRefund ? "refund" : "transfer",
            amount: actions[0].args.deposit as YoctoNEAR,
          };
      }
    };

    return (
      <AccountActivityBadge
        action={getActionMapping(actions as any, signerId === "system")}
      />
    );
  }
);

export default TransactionType;
