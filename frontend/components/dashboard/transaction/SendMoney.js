import TransactionRow from "./transaction";

import SendMoneyIcon from "../../../static/images/icon-t-transfer.svg";

const SendMoney = props => (
  <TransactionRow {...props}>
    <SendMoneyIcon />
  </TransactionRow>
);

export default SendMoney;
