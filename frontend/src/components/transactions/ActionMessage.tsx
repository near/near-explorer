import * as React from "react";

import { hexy } from "hexy";
import { useTranslation } from "next-i18next";

import { Action } from "@/common/types/procedures";
import AccountLink from "@/frontend/components/utils/AccountLink";
import Balance from "@/frontend/components/utils/Balance";
import CodePreview from "@/frontend/components/utils/CodePreview";
import { styled } from "@/frontend/libraries/styles";

export interface Props<A extends Action> {
  action: A;
  receiverId: string;
  showDetails?: boolean;
}

type InferAction<Kind extends Action["kind"], A = Action> = A extends {
  kind: Kind;
}
  ? A
  : never;

type TransactionMessageRenderers = {
  [K in Action["kind"]]: React.FC<Props<InferAction<K>>>;
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

const createAccount: TransactionMessageRenderers["createAccount"] = React.memo(
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

const deleteAccount: TransactionMessageRenderers["deleteAccount"] = React.memo(
  ({ receiverId, action }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.DeleteAccount.delete_account")}
        <AccountLink accountId={receiverId} />
        {t(
          "component.transactions.ActionMessage.DeleteAccount.and_transfer_fund_to"
        )}
        <AccountLink accountId={action.args.beneficiaryId} />
      </>
    );
  }
);

const deployContract: TransactionMessageRenderers["deployContract"] =
  React.memo(({ receiverId }) => {
    const { t } = useTranslation();
    return (
      <>
        {t(
          "component.transactions.ActionMessage.DeployContract.contract_deployed"
        )}
        <AccountLink accountId={receiverId} />
      </>
    );
  });

const functionCall: TransactionMessageRenderers["functionCall"] = React.memo(
  ({ receiverId, action, showDetails }) => {
    const { t } = useTranslation();
    let args;
    if (showDetails) {
      if (typeof action.args.args === "undefined") {
        args = <p>Loading...</p>;
      } else if (
        (typeof action.args.args === "string" &&
          action.args.args.length === 0) ||
        !action.args.args
      ) {
        args = <p>The arguments are empty</p>;
      } else {
        args = <Args args={action.args.args} />;
      }
    }
    return (
      <>
        {t("component.transactions.ActionMessage.FunctionCall.called_method", {
          method_name: action.args.methodName,
        })}
        <AccountLink accountId={receiverId} />
        {showDetails ? (
          <dl>
            <dt>
              {t(
                "component.transactions.ActionMessage.FunctionCall.arguments",
                { method_name: action.args.methodName }
              )}
            </dt>
            <dd>{args}</dd>
          </dl>
        ) : null}
      </>
    );
  }
);

const transfer: TransactionMessageRenderers["transfer"] = React.memo(
  ({ receiverId, action }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.Transfer.transferred")}
        <Balance amount={action.args.deposit} />
        {t("component.transactions.ActionMessage.Transfer.to")}
        <AccountLink accountId={receiverId} />
      </>
    );
  }
);

const stake: TransactionMessageRenderers["stake"] = React.memo(({ action }) => {
  const { t } = useTranslation();
  return (
    <>
      {t("component.transactions.ActionMessage.Stake.staked")}
      <Balance amount={action.args.stake} />{" "}
      {t("component.transactions.ActionMessage.Stake.with_key", {
        public_key: action.args.publicKey.substring(0, 15),
      })}
    </>
  );
});

const addKey: TransactionMessageRenderers["addKey"] = React.memo(
  ({ receiverId, action }) => {
    const { t } = useTranslation();
    return (
      <>
        {action.args.accessKey.permission.type !== "fullAccess" ? (
          <>
            {t(
              "component.transactions.ActionMessage.AddKey.access_key_added_for_contract"
            )}
            <AccountLink
              accountId={action.args.accessKey.permission.contractId}
            />
            {`: ${action.args.publicKey.substring(0, 15)}...`}
            <p>
              {t(
                "component.transactions.ActionMessage.AddKey.with_permission_call_method_and_nounce",
                {
                  methods:
                    action.args.accessKey.permission.methodNames.length > 0
                      ? `(${action.args.accessKey.permission.methodNames.join(
                          ", "
                        )})`
                      : t("component.transactions.ActionMessage.AddKey.any"),
                  nonce: action.args.accessKey.nonce,
                }
              )}
            </p>
          </>
        ) : (
          <>
            {t("component.transactions.ActionMessage.AddKey.new_key_added")}
            <AccountLink accountId={receiverId} />
            {`: ${action.args.publicKey.substring(0, 15)}...`}
            <p>
              {t(
                "component.transactions.ActionMessage.AddKey.fullAccessPermission"
              )}
            </p>
          </>
        )}
      </>
    );
  }
);

const deleteKey: TransactionMessageRenderers["deleteKey"] = React.memo(
  ({ action }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.DeleteKey.key_deleted", {
          public_key: action.args.publicKey.substring(0, 15),
        })}
      </>
    );
  }
);

const DelegateActionsWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  marginLeft: 16,
});

const DelegateActionWrapper = styled("div", {
  marginTop: 4,
});

const delegateAction: TransactionMessageRenderers["delegateAction"] =
  React.memo(({ action, showDetails }) => {
    const { t } = useTranslation();
    return (
      <>
        {t("component.transactions.ActionMessage.Delegate.delegated", {
          senderId: action.args.senderId,
        })}
        <DelegateActionsWrapper>
          {[...action.args.actions]
            .sort(
              (actionA, actionB) =>
                actionA.delegateIndex - actionB.delegateIndex
            )
            .map((subaction) => (
              <DelegateActionWrapper key={subaction.delegateIndex}>
                {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                <ActionMessage
                  receiverId={action.args.receiverId}
                  action={subaction}
                  showDetails={showDetails}
                />
              </DelegateActionWrapper>
            ))}
        </DelegateActionsWrapper>
      </>
    );
  });

const transactionMessageRenderers: TransactionMessageRenderers = {
  createAccount,
  deleteAccount,
  deployContract,
  functionCall,
  transfer,
  stake,
  addKey,
  deleteKey,
  delegateAction,
};

const ActionMessage: React.FC<Props<Action>> = React.memo((props) => {
  const MessageRenderer = transactionMessageRenderers[props.action.kind];
  if (MessageRenderer === undefined) {
    return (
      <>
        `${props.action.kind}: ${JSON.stringify(props.action.args)}`
      </>
    );
  }

  return <MessageRenderer {...(props as any)} />;
});

export default ActionMessage;
