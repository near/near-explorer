import TransactionRow from "./transaction";

import CreateAccountIcon from "../../../static/images/icon-t-acct.svg";

const CreateAccount = props => (
  <TransactionRow {...props}>
    <CreateAccountIcon />
  </TransactionRow>
);

export default CreateAccount;
