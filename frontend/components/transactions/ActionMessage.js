import { formatNEAR } from "../utils/Balance";

const transactionMessageRenderers = {
  CreateAccount: ({ transaction: { receiverId } }) =>
    `New Account Created: @${receiverId}`,
  DeleteAccount: ({ transaction: { receiverId } }) =>
    `Account Deleted: @${receiverId}`,
  DeployContract: ({ transaction: { receiverId } }) =>
    `Contract Deployed: ${receiverId}`,
  FunctionCall: ({ transaction: { receiverId } }) =>
    `Call: Called method in contract "${receiverId}"`,
  Transfer: ({ transaction: { receiverId }, actionArgs: { deposit } }) =>
    `Transfered ${formatNEAR(deposit)} Ⓝ to @${receiverId}`,
  Stake: ({ actionArgs: { stake, public_key } }) =>
    `Staked: ${formatNEAR(stake)} Ⓝ ${public_key.substring(0, 15)}...`,
  AddKey: ({ transaction: { receiverId }, actionArgs }) => {
    return typeof actionArgs.access_key.permission === "object"
      ? `Access key for contract: "${
          actionArgs.access_key.permission.FunctionCall.receiver_id
        }"`
      : `New Key Added for @${receiverId}: ${actionArgs.public_key.substring(
          0,
          15
        )}...`;
  },
  DeleteKey: ({ actionArgs: { public_key } }) =>
    `Key Deleted: ${public_key.substring(0, 15)}...`
};

export default props => {
  const MessageRenderer = transactionMessageRenderers[props.actionKind];
  if (MessageRenderer === undefined) {
    return `${props.actionKind}: ${JSON.stringify(props.actionArgs)}`;
  }
  return <MessageRenderer {...props} />;
};
