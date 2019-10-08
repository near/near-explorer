import { formatNEAR } from "../utils/Balance";

const transactionMessageRenderers = {
  CreateAccount: ({ transaction: { receiverId } }) =>
    `New account created: @${receiverId}`,
  DeleteAccount: ({ transaction: { receiverId } }) =>
    `Account deleted: @${receiverId}`,
  DeployContract: ({ transaction: { receiverId } }) =>
    `Contract deployed: ${receiverId}`,
  FunctionCall: ({ transaction: { receiverId } }) =>
    `Called method in contract: "${receiverId}"`,
  Transfer: ({ transaction: { receiverId }, actionArgs: { deposit } }) =>
    `Transferred ${formatNEAR(deposit)} Ⓝ to @${receiverId}`,
  Stake: ({ actionArgs: { stake, public_key } }) =>
    `Staked: ${formatNEAR(stake)} Ⓝ ${public_key.substring(0, 15)}...`,
  AddKey: ({ transaction: { receiverId }, actionArgs }) => {
    return typeof actionArgs.access_key.permission === "object"
      ? `Access key added for contract: "${
          actionArgs.access_key.permission.FunctionCall.receiver_id
        }"`
      : `New key added for @${receiverId}: ${actionArgs.public_key.substring(
          0,
          15
        )}...`;
  },
  DeleteKey: ({ actionArgs: { public_key } }) =>
    `Key deleted: ${public_key.substring(0, 15)}...`
};

export default props => {
  const MessageRenderer = transactionMessageRenderers[props.actionKind];
  if (MessageRenderer === undefined) {
    return `${props.actionKind}: ${JSON.stringify(props.actionArgs)}`;
  }
  return <MessageRenderer {...props} />;
};
