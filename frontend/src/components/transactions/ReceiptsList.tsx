import ReceiptRow from "./ReceiptRow";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  receipt: T.ExecutionOutcomeReceipts;
}

const ReceiptsList = ({ receipt }: Props) => {
  return <ReceiptRow receipt={receipt} />;
};

export default ReceiptsList;
