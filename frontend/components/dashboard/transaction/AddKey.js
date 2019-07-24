import TransactionRow from "./transaction";

import AddKeyIcon from "../../../static/images/icon-t-key-new.svg";

const AddKey = props => (
  <TransactionRow {...props}>
    <AddKeyIcon />
  </TransactionRow>
);

export default AddKey;
