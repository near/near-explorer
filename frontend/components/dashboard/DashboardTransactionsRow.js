import AddKey from "./transaction/AddKey";
import CreateAccount from "./transaction/CreateAccount";
import FunctionCall from "./transaction/FunctionCall";

const DashboardTransactionRow = props => {
  switch (props.txKind) {
    case "AddKey":
      return <AddKey {...props} />;
    case "CreateAccount":
      return <CreateAccount {...props} />;
    case "FunctionCall":
      return <FunctionCall {...props} />;
    default:
      return null;
  }
};

export default DashboardTransactionRow;
