import * as T from "../../libraries/explorer-wamp/transactions";

import ReceiptRow from "./ReceiptRow";

export interface Props {
  receipts: T.ReceiptOutcome[];
}

export default ({ receipts }: Props) => {
  const status = receipts.map(receipt => {
    return [receipt.id, receipt.outcome.status];
  });
  console.log(receipts);
  console.log(status);
  return (
    <>
      {receipts.map(receipt => (
        <ReceiptRow key={receipt.id} receipt={receipt} />
      ))}
    </>
  );
};
