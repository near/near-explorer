import * as T from "../../libraries/explorer-wamp/transactions";

import ReceiptRow from "./ReceiptRow";

export interface Props {
  receipts: T.ReceiptOutcome[];
}

export default ({ receipts }: Props) => {
  return (
    <>
      {receipts.map(receipt => (
        <ReceiptRow key={receipt.id} receipt={receipt} />
      ))}
    </>
  );
};
