import * as React from "react";
import { hexy } from "hexy";

import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import CodePreview from "../utils/CodePreview";

import { useTranslation } from "react-i18next";
import { Action, ActionMapping } from "../../types/common";

export interface Props<A extends Action> {
  actionKind: A["kind"];
  actionArgs: A["args"];
  receiverId: string;
  showDetails?: boolean;
}

type TransactionMessageRenderers = {
  [K in Action["kind"]]: React.FC<Props<ActionMapping[K]>>;
};

export const Args: React.FC<{ args: string }> = React.memo(({ args }) => {
  const decodedArgs = Buffer.from(args, "base64");
  let prettyArgs: string;
  try {
    const parsedJSONArgs = JSON.parse(decodedArgs.toString());
    prettyArgs = JSON.stringify(parsedJSONArgs, null, 2);
  } catch {
    prettyArgs = hexy(decodedArgs, { format: "twos" });
  }
  return (
    <CodePreview collapseHeight={200} maxHeight={600} value={prettyArgs} />
  );
});

const CreateAccount: TransactionMessageRenderers["CreateAccount"] = React.memo(
  ({ receiverId }) => {
    const { t } = useTranslation();
    return (
      <>
        {t(
          "component.transactions.ActionMessage.CreateAccount.new_account_created"
        )}
        <AccountLink accountId={receiverId} />
      </>
    );
  }
);

const DeleteAccount: TransactionMessageRenderers["DeleteAccount"] = React.memo(
  ({ receiverId, actionArgs }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.DeleteAccount.delete_account")}
        <AccountLink accountId={receiverId} />
        {t(
          "component.transactions.ActionMessage.DeleteAccount.and_transfer_fund_to"
        )}
        <AccountLink accountId={actionArgs.beneficiary_id} />
      </>
    );
  }
);

const DeployContract: TransactionMessageRenderers["DeployContract"] = React.memo(
  ({ receiverId }) => {
    const { t } = useTranslation();
    return (
      <>
        {t(
          "component.transactions.ActionMessage.DeployContract.contract_deployed"
        )}
        <AccountLink accountId={receiverId} />
      </>
    );
  }
);

const FunctionCall: TransactionMessageRenderers["FunctionCall"] = React.memo(
  ({ receiverId, actionArgs, showDetails }) => {
    const { t } = useTranslation();
    let args;
    if (showDetails) {
      if (typeof actionArgs.args === "undefined") {
        args = <p>Loading...</p>;
      } else if (
        (typeof actionArgs.args === "string" && actionArgs.args.length === 0) ||
        !actionArgs.args
      ) {
        args = <p>The arguments are empty</p>;
      } else {
        args = <Args args={actionArgs.args} />;
      }
    }
    return (
      <>
        {t("component.transactions.ActionMessage.FunctionCall.called_method", {
          method_name: actionArgs.method_name,
        })}
        <AccountLink accountId={receiverId} />
        {showDetails ? (
          <dl>
            <dt>
              {t(
                "component.transactions.ActionMessage.FunctionCall.arguments",
                { method_name: actionArgs.method_name }
              )}
            </dt>
            <dd>{args}</dd>
          </dl>
        ) : null}
      </>
    );
  }
);

const Transfer: TransactionMessageRenderers["Transfer"] = React.memo(
  ({ receiverId, actionArgs: { deposit } }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.Transfer.transferred")}
        <Balance amount={deposit} />
        {t("component.transactions.ActionMessage.Transfer.to")}
        <AccountLink accountId={receiverId} />
      </>
    );
  }
);

const Stake: TransactionMessageRenderers["Stake"] = React.memo(
  ({ actionArgs: { stake, public_key } }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.Stake.staked")}
        <Balance amount={stake} />{" "}
        {t("component.transactions.ActionMessage.Stake.with_key", {
          public_key: public_key.substring(0, 15),
        })}
      </>
    );
  }
);

const AddKey: TransactionMessageRenderers["AddKey"] = React.memo(
  ({ receiverId, actionArgs }) => {
    const { t } = useTranslation();
    return (
      <>
        {actionArgs.access_key.permission !== "FullAccess" ? (
          <>
            {t(
              "component.transactions.ActionMessage.AddKey.access_key_added_for_contract"
            )}
            <AccountLink
              accountId={
                actionArgs.access_key.permission.FunctionCall.receiver_id
              }
            />
            {`: ${actionArgs.public_key.substring(0, 15)}...`}
            <p>
              {t(
                "component.transactions.ActionMessage.AddKey.with_permission_call_method_and_nounce",
                {
                  methods:
                    actionArgs.access_key.permission.FunctionCall.method_names
                      .length > 0
                      ? `(${actionArgs.access_key.permission.FunctionCall.method_names.join(
                          ", "
                        )})`
                      : t("component.transactions.ActionMessage.AddKey.any"),
                  nonce: actionArgs.access_key.nonce,
                }
              )}
            </p>
          </>
        ) : (
          <>
            {t("component.transactions.ActionMessage.AddKey.new_key_added")}
            <AccountLink accountId={receiverId} />
            {`: ${actionArgs.public_key.substring(0, 15)}...`}
            <p>
              {t(
                "component.transactions.ActionMessage.AddKey.with_permission_and_nounce",
                {
                  permission: actionArgs.access_key.permission,
                  nonce: actionArgs.access_key.nonce,
                }
              )}
            </p>
          </>
        )}
      </>
    );
  }
);

const DeleteKey: TransactionMessageRenderers["DeleteKey"] = React.memo(
  ({ actionArgs: { public_key } }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.DeleteKey.key_deleted", {
          public_key: public_key.substring(0, 15),
        })}
      </>
    );
  }
);

const transactionMessageRenderers: TransactionMessageRenderers = {
  CreateAccount,
  DeleteAccount,
  DeployContract,
  FunctionCall,
  Transfer,
  Stake,
  AddKey,
  DeleteKey,
};

const ActionMessage: React.FC<Props<Action>> = React.memo((props) => {
  const MessageRenderer = transactionMessageRenderers[props.actionKind];
  if (MessageRenderer === undefined) {
    return (
      <>
        `${props.actionKind}: ${JSON.stringify(props.actionArgs)}`
      </>
    );
  }

  return <MessageRenderer {...(props as any)} />;
});

export default ActionMessage;
