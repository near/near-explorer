import AddKey from "./transaction/AddKey";
import CreateAccount from "./transaction/CreateAccount";
import FunctionCall from "./transaction/FunctionCall";
import TransactionRow from "./transaction/transaction";

const DashboardTransactionRow = props => {
  const components = {
    AddKey,
    CreateAccount,
    FunctionCall
  };

  const Component = components[props.txKind] || TransactionRow;
  return <Component {...props} />;
};

export default DashboardTransactionRow;
