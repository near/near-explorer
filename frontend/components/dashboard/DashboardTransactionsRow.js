import AddKey from "./transaction/AddKey";
import CreateAccount from "./transaction/CreateAccount";
import FunctionCall from "./transaction/FunctionCall";
import TransactionRow from "./transaction/transaction";

const DashboardTransactionRow = props => {
  switch (props.txKind) {
    case "AddKey":
      return <AddKey {...props} />;
    case "CreateAccount":
      return <CreateAccount {...props} />;
    case "FunctionCall":
      return <FunctionCall {...props} />;
    default:
      return <TransactionRow {...props} />;
  }
};

export default DashboardTransactionRow;
