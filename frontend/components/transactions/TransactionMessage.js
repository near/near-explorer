const transactionMessageRenderers = {
  CreateAccount: ({ args }) =>
    `New Account Created: @${args.new_account_id}, balance: ${args.amount}`,
  DeployContract: ({ args }) => `Contract Deployed: ${args.contract_id}`,
  FunctionCall: ({ args }) =>
    `Call: Called method in contract "${args.contract_id}"`,
  SendMoney: ({ args }) => `Sent: ${args.amount} N to @${args.receiver}`,
  Stake: ({ args }) =>
    `Staked: ${args.amount} N ${args.public_key.substring(0, 7)}...`,
  SwapKey: ({ args }) =>
    `Key Swapped: Old key ${args.cur_key} swapped with ${args.new_key}`,
  AddKey: ({ args }) => {
    return args.access_key
      ? `Access key for contract: "${args.access_key.contract_id}"`
      : `New Key Created: ${args.new_key}`;
  },
  DeleteKey: ({ args }) => `Key Deleted: ${args.cur_key}`
};

export default props => {
  const messageRenderer = transactionMessageRenderers[props.txn.kind];
  if (messageRenderer === undefined) {
    return `${props.txn.kind}: ${JSON.stringify(props.txn.args)}`;
  }
  return messageRenderer(props.txn);
};
