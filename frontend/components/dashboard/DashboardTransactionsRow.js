import AddKey from "./transaction/AddKey";
import CreateAccount from "./transaction/CreateAccount";
import FunctionCall from "./transaction/FunctionCall";
import SendMoney from "./transaction/SendMoney";

import TransactionRow from "./transaction/transaction";

const components = {
  AddKey,
  CreateAccount,
  FunctionCall,
  SendMoney
};

const DashboardTransactionRow = props => {
  const Component = components[props.txKind] || TransactionRow;
  return <Component {...props} />;
};

export default DashboardTransactionRow;
