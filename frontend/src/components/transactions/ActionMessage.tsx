import { hexy } from "hexy";

import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import CodePreview from "../utils/CodePreview";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props<A> {
  actionKind: keyof TransactionMessageRenderers;
  actionArgs: A;
  transaction: T.Transaction;
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

const COLLAPSE_ARGS_OPTIONS = {
  collapseText: "Show more",
  expandText: "Show less",
  minHeight: 200,
  maxHeight: 600,
};

const transactionMessageRenderers: TransactionMessageRenderers = {
  CreateAccount: ({ transaction: { receiverId } }: Props<T.CreateAccount>) => (
    <>
      {"New account created: "}
      <AccountLink accountId={receiverId} />
    </>
  ),
  DeleteAccount: ({ transaction: { receiverId } }: Props<T.DeleteAccount>) => (
    <>
      {"Account deleted: "}
      <AccountLink accountId={receiverId} />
    </>
  ),
  DeployContract: ({
    transaction: { receiverId },
  }: Props<T.DeployContract>) => (
    <>
      {"Contract deployed: "}
      <AccountLink accountId={receiverId} />
    </>
  ),
  FunctionCall: ({
    transaction: { receiverId },
    actionArgs,
    showDetails,
  }: Props<T.FunctionCall>) => {
    let args;
    if (showDetails) {
      if (!actionArgs.args) {
        args = <p>Loading...</p>;
      } else {
        const decodedArgs = Buffer.from(actionArgs.args, "base64");
        let prettyArgs;
        try {
          const parsedJSONArgs = JSON.parse(decodedArgs.toString());
          prettyArgs = JSON.stringify(parsedJSONArgs, null, 2);
        } catch {
          prettyArgs = hexy(decodedArgs, { format: "twos" });
        }
        args = (
          <CodePreview
            collapseOptions={COLLAPSE_ARGS_OPTIONS}
            value={prettyArgs}
          />
        );
      }
    }

    return (
      <>
        {`Called method: '${actionArgs.method_name}' in contract: `}
        <AccountLink accountId={receiverId} />
        {showDetails ? (
          <dl>
            <dt>Arguments:</dt>
            <dd>{args}</dd>
          </dl>
        ) : null}
      </>
    );
  },
  Transfer: ({
    transaction: { receiverId },
    actionArgs: { deposit },
  }: Props<T.Transfer>) => (
    <>
      {`Transferred `}
      <Balance amount={deposit} />
      {` to `}
      <AccountLink accountId={receiverId} />
    </>
  ),
  Stake: ({ actionArgs: { stake, public_key } }: Props<T.Stake>) => (
    <>
      {`Staked: `}
      <Balance amount={stake} /> {`with ${public_key.substring(0, 15)}...`}
    </>
  ),
  AddKey: ({ transaction: { receiverId }, actionArgs }: Props<T.AddKey>) => (
    <>
      {typeof actionArgs.access_key.permission === "object" ? (
        <>
          {"Access key added for contract: "}
          <AccountLink
            accountId={
              actionArgs.access_key.permission.FunctionCall.receiver_id
            }
          />
        </>
      ) : (
        <>
          {"New key added for "}
          <AccountLink accountId={receiverId} />
          {`: ${actionArgs.public_key.substring(0, 15)}...`}
        </>
      )}
    </>
  ),
  DeleteKey: ({ actionArgs: { public_key } }: Props<T.DeleteKey>) => (
    <>{`Key deleted: ${public_key.substring(0, 15)}...`}</>
  ),
};

export default (props: Props<AnyAction>) => {
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
