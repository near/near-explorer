import * as T from "../../libraries/explorer-wamp/transactions";
import ReceiptOutcomeRow from "./ReceiptOutcomeRow";
export interface Props {
  receipts: T.ReceiptsOutcomeList;
}

export default ({ receipts }: Props) => {
  const {
    converted_into_receipt,
    receipts_outcome: receiptsOutcome,
    receipts: receiptsInfo,
  } = receipts;

  const receiptsOutcomeObj = receiptsOutcome.reduce(
    (obj, receiptsOutcomeItem) => ({
      ...obj,
      [receiptsOutcomeItem.id]: receiptsOutcomeItem,
    }),
    {}
  );
  const receiptsInfoObj = receiptsInfo.reduce(
    (obj, receiptInfoItem) => ({
      ...obj,
      [receiptInfoItem.receipt_id]: receiptInfoItem,
    }),
    {}
  );

  return (
    <ReceiptOutcomeRow
      sirReceiptHash={converted_into_receipt.receipt_id}
      receiptsObj={receiptsOutcomeObj}
      receiptsInfoObj={receiptsInfoObj}
      senderIsReceiverActions={converted_into_receipt.actions}
      senderIsReceiver
    />
  );
};
