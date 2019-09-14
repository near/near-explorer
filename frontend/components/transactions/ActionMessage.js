import { formatNEAR } from "../utils/Balance";

const transactionMessageRenderers = {
  CreateAccount: ({ transaction: { signerId } }) =>
    `New Account Created: @${signerId}`,
  DeleteAccount: ({ transaction: { signerId } }) =>
    `Account Deleted: @${signerId}`,
  DeployContract: ({ transaction: { signerId } }) =>
    `Contract Deployed: ${signerId}`,
  FunctionCall: ({ transaction: { receiverId } }) =>
    `Call: Called method in contract "${receiverId}"`,
  Transfer: ({ transaction: { receiverId }, actionArgs: { deposit } }) =>
    `Transfered ${formatNEAR(deposit)} Ⓝ to @${receiverId}`,
  Stake: ({ actionArgs: { stake, public_key } }) =>
    `Staked: ${formatNEAR(stake)} Ⓝ ${public_key.substring(0, 15)}...`,
  AddKey: ({ transaction: { receiverId }, actionArgs }) => {
    return actionArgs.access_key
      ? `Access key for contract: "${receiverId}"`
      : `New Key Created: ${actionArgs.publicKey}`;
  },
  DeleteKey: ({ actionArgs: { public_key } }) => `Key Deleted: ${public_key}`
};

export default props => {
  const MessageRenderer = transactionMessageRenderers[props.actionKind];
  if (MessageRenderer === undefined) {
    return `${props.actionKind}: ${JSON.stringify(props.actionArgs)}`;
  }
  return <MessageRenderer {...props} />;
};
