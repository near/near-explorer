import ReceiptRow from "./ReceiptRow";

import * as T from "../../libraries/explorer-wamp/transactions";

export interface Props {
  receipts: T.ReceiptsList[];
  receiptsOutcome: T.ReceiptOutcome[];
  transaction: T.Transaction;
}

export default ({ receipts, receiptsOutcome, transaction }: Props) => {
  if (receipts[0].receipt_id !== receiptsOutcome[0].id) {
    receipts.unshift({
      predecessor_id: transaction.signerId,
      receipt: transaction.actions,
      receipt_id: receiptsOutcome[0].id,
      receiver_id: transaction.receiverId,
    });
  }

  const receiptOutcomesById =
    receiptsOutcome && receiptsOutcome.length > 0
      ? receiptsOutcome.reduce(
          (obj, receiptOutcomeItem: T.ReceiptOutcome) => ({
            ...obj,
            [receiptOutcomeItem.id]: receiptOutcomeItem,
          }),
          {}
        )
      : {};
  const receiptsById = receipts
    .map((receiptByIdItem) => {
      let actionsList = [];
      if (receiptByIdItem.receipt_id === receiptsOutcome[0].id) {
        actionsList = transaction.actions;
      } else {
        const { Action: action = null } = receiptByIdItem?.receipt;

        actionsList = action?.actions.map((action: T.RpcAction | string) => {
          if (typeof action === "string") {
            return { kind: action, args: {} };
          } else {
            const kind = Object.keys(action)[0] as keyof T.RpcAction;
            return {
              kind,
              args: action[kind],
            };
          }
        });
      }

      return {
        ...receiptByIdItem,
        receipt: actionsList,
      };
    })
    .reduce(
      (obj, receipt) => ({
        ...obj,
        [receipt.receipt_id]: receipt,
      }),
      {}
    );

  return (
    <ReceiptRow
      convertedReceiptHash={receiptsOutcome[0].id}
      receiptOutcomesById={receiptOutcomesById}
      receiptsById={receiptsById}
      convertedReceipt
      transaction={transaction}
    />
  );
};
