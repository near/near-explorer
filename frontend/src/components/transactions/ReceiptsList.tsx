import * as T from "../../libraries/explorer-wamp/transactions";

import ReceiptRow from "./ReceiptRow";

export interface Props {
  receipts: T.ReceiptOutcome[];
}

const ReceiptList = ({ receipts }: Props) => {
  return (
    <>
      {receipts.map((receipt) => (
        <ReceiptRow key={receipt.id} receipt={receipt} />
      ))}
    </>
  );
};

export default ReceiptList;
