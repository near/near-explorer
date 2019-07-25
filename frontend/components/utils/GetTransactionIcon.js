import AddKey from "../../static/images/icon-t-key-new.svg";
import FunctionCall from "../../static/images/icon-t-call.svg";
import Sent from "../../static/images/icon-t-transfer.svg";
import Staked from "../../static/images/icon-t-stake.svg";
import DeployContract from "../../static/images/icon-t-contract.svg";
import CreateAccount from "../../static/images/icon-t-acct.svg";

const GetTransactionIcon = {
  FunctionCall: <FunctionCall />,
  Sent: <Sent />,
  Staked: <Staked />,
  DeployContract: <DeployContract />,
  AddKey: <AddKey />,
  CreateAccount: <CreateAccount />
};

export default GetTransactionIcon;
