import AccountLink from "../utils/AccountLink";
import { formatNEAR } from "../utils/Balance";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props<A> {
  actionKind: keyof TransactionMessageRenderers;
  actionArgs: A;
  transaction: T.Transaction;
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
    transaction: { receiverId }
  }: Props<T.DeployContract>) => <>{`Contract deployed: ${receiverId}`}</>,
  FunctionCall: ({
    transaction: { receiverId },
    actionArgs
  }: Props<T.FunctionCall>) => {
    const args = Buffer.from(actionArgs.args, "base64").toString();
    const args_object = JSON.parse(args);
    let parameter = Object.keys(args_object);
    return (
      <>
        {`Called method: ${
          actionArgs.method_name
        } with args {${parameter}} in contract: `}
        <AccountLink accountId={receiverId} />
      </>
    );
  },
  Transfer: ({
    transaction: { receiverId },
    actionArgs: { deposit }
  }: Props<T.Transfer>) => (
    <>
      {`Transferred ${formatNEAR(deposit)} Ⓝ to `}
      <AccountLink accountId={receiverId} />
    </>
  ),
  Stake: ({ actionArgs: { stake, public_key } }: Props<T.Stake>) => (
    <>{`Staked: ${formatNEAR(stake)} Ⓝ ${public_key.substring(0, 15)}...`}</>
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
  )
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
  return <MessageRenderer {...props as any} />;
};
