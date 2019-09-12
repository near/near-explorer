const transactionMessageRenderers = {
  CreateAccount: ({ actionArgs }) =>
    `New Account Created: @${actionArgs.new_account_id}, balance: ${
      actionArgs.amount
    }`,
  DeleteAccount: ({ actionArgs }) =>
    `Account Deleted: ${actionArgs.account_id}`,
  DeployContract: ({ actionArgs }) =>
    `Contract Deployed: ${actionArgs.contract_id}`,
  FunctionCall: ({ actionArgs }) =>
    `Call: Called method in contract "${actionArgs.contract_id}"`,
  Transfer: ({ actionArgs }) =>
    `Transfered ${actionArgs.amount} N to @${actionArgs.receiver}`,
  Stake: ({ actionArgs }) =>
    `Staked: ${actionArgs.amount} N ${actionArgs.public_key.substring(
      0,
      7
    )}...`,
  AddKey: ({ actionArgs }) => {
    return actionArgs.access_key
      ? `Access key for contract: "${actionArgs.access_key.contract_id}"`
      : `New Key Created: ${actionArgs.new_key}`;
  },
  DeleteKey: ({ actionArgs }) => `Key Deleted: ${actionArgs.cur_key}`
};

export default props => {
  const messageRenderer = transactionMessageRenderers[props.actionKind];
  if (messageRenderer === undefined) {
    return `${props.actionKind}: ${JSON.stringify(props.actionArgs)}`;
  }
  return messageRenderer(props);
};
