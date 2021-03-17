import ReceiptRow from "./ReceiptRow";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  receipts: T.Receipts;
  convertedReceiptHash: string;
}

const ReceiptsList = ({ receipts, convertedReceiptHash }: Props) => {
  console.log("receipts", receipts);
  console.log("convertedReceiptHash", convertedReceiptHash);

  return (
    <ReceiptRow
      convertedReceiptHash={convertedReceiptHash}
      receipts={receipts}
      convertedReceipt
    />
  );
};

export default ReceiptsList;
