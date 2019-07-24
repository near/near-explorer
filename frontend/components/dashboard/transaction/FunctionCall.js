import TransactionRow from "./transaction";

import FunctionCallIcon from "../../../static/images/icon-t-call.svg";

const FunctionCall = props => (
  <TransactionRow {...props}>
    <FunctionCallIcon />
  </TransactionRow>
);

export default FunctionCall;
