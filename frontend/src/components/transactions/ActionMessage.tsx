import { hexy } from "hexy";

import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import CodePreview from "../utils/CodePreview";

import * as T from "../../libraries/explorer-wamp/transactions";

import { TFunction, useTranslation } from "react-i18next";

export interface Props<A> {
  actionKind: keyof TransactionMessageRenderers;
  actionArgs: A;
  receiverId: string;
  showDetails?: boolean;
}

type AnyAction =
  | T.CreateAccount
  | T.DeleteAccount
  | T.DeployContract
  | T.FunctionCall
  | T.Transfer
  | T.Stake
  | T.AddKey
  | T.DeleteKey;

interface TransactionMessageRenderers {
  CreateAccount: React.FC<Props<T.CreateAccount>>;
  DeleteAccount: React.FC<Props<T.DeleteAccount>>;
  DeployContract: React.FC<Props<T.DeployContract>>;
  FunctionCall: React.FC<Props<T.FunctionCall>>;
  Transfer: React.FC<Props<T.Transfer>>;
  Stake: React.FC<Props<T.Stake>>;
  AddKey: React.FC<Props<T.AddKey>>;
  DeleteKey: React.FC<Props<T.DeleteKey>>;
}

export const displayArgs = (args: string, t: TFunction<"common">) => {
  const decodedArgs = Buffer.from(args, "base64");
  let prettyArgs: string;
  try {
    const parsedJSONArgs = JSON.parse(decodedArgs.toString());
    prettyArgs = JSON.stringify(parsedJSONArgs, null, 2);
  } catch {
    prettyArgs = hexy(decodedArgs, { format: "twos" });
  }
  return (
    <CodePreview
      collapseOptions={{
        collapseText: t("button.show_more"),
        expandText: t("button.show_less"),
        minHeight: 200,
        maxHeight: 600,
      }}
      value={prettyArgs}
    />
  );
};

const transactionMessageRenderers: TransactionMessageRenderers = {
  CreateAccount: ({ receiverId }: Props<T.CreateAccount>) => {
    const { t } = useTranslation();
    return (
      <>
        {t(
          "component.transactions.ActionMessage.CreateAccount.new_account_created"
        )}
        <AccountLink accountId={receiverId} />
      </>
    );
  },
  DeleteAccount: ({ receiverId, actionArgs }: Props<T.DeleteAccount>) => {
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
  },
  DeployContract: ({ receiverId }: Props<T.DeployContract>) => {
    const { t } = useTranslation();
    return (
      <>
        {t(
          "component.transactions.ActionMessage.DeployContract.contract_deployed"
        )}
        <AccountLink accountId={receiverId} />
      </>
    );
  },
  FunctionCall: ({
    receiverId,
    actionArgs,
    showDetails,
  }: Props<T.FunctionCall>) => {
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
        args = displayArgs(actionArgs.args, t);
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
  },
  Transfer: ({ receiverId, actionArgs: { deposit } }: Props<T.Transfer>) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.Transfer.transferred")}
        <Balance amount={deposit} />
        {t("component.transactions.ActionMessage.Transfer.to")}
        <AccountLink accountId={receiverId} />
      </>
    );
  },
  Stake: ({ actionArgs: { stake, public_key } }: Props<T.Stake>) => {
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
  },
  AddKey: ({ receiverId, actionArgs }: Props<T.AddKey>) => {
    const { t } = useTranslation();
    return (
      <>
        {typeof actionArgs.access_key.permission === "object" ? (
          actionArgs.access_key.permission.permission_kind ? (
            <>
              {t("component.transactions.ActionMessage.AddKey.new_key_added")}
              <AccountLink accountId={receiverId} />
              {`: ${actionArgs.public_key.substring(0, 15)}...`}
              <p>
                {t(
                  "component.transactions.ActionMessage.AddKey.with_permission_and_nounce",
                  {
                    permission:
                      actionArgs.access_key.permission.permission_kind,
                    nonce: actionArgs.access_key.nonce,
                  }
                )}
              </p>
            </>
          ) : (
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
          )
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
  },
  DeleteKey: ({ actionArgs: { public_key } }: Props<T.DeleteKey>) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.DeleteKey.key_deleted", {
          public_key: public_key.substring(0, 15),
        })}
      </>
    );
  },
};

const ActionMessage = (props: Props<AnyAction>) => {
  const MessageRenderer = transactionMessageRenderers[props.actionKind];
  if (MessageRenderer === undefined) {
    return (
      <>
        `${props.actionKind}: ${JSON.stringify(props.actionArgs)}`
      </>
    );
  }
  return (
    <MessageRenderer {...(props as any)} showDetails={props.showDetails} />
  );
};

export default ActionMessage;
