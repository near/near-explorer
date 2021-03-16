import renderer from "react-test-renderer";

import ReceiptRow from "../ReceiptRow";

import { TRANSACTIONS, RECEIPT_OUTCOMES_BY_ID, RECEIPTS_BY_ID } from "./common";

describe("<ReceiptRow />", () => {
  it("renders SuccessValue", () => {
    expect(
      renderer.create(
        <ReceiptRow
          convertedReceiptHash={
            (TRANSACTIONS[0].receiptsOutcome || [
              { id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs" },
            ])[0].id
          }
          receiptOutcomesById={RECEIPT_OUTCOMES_BY_ID[0]}
          receiptsById={RECEIPTS_BY_ID[0]}
          convertedReceipt
          transaction={TRANSACTIONS[0]}
          key={(TRANSACTIONS[0].receiptsOutcome || [])[0].id || "aaa"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders SuccessReceiptId", () => {
    expect(
      renderer.create(
        <ReceiptRow
          convertedReceiptHash={
            (TRANSACTIONS[1].receiptsOutcome || [
              { id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222" },
            ])[0].id
          }
          receiptOutcomesById={RECEIPT_OUTCOMES_BY_ID[1]}
          receiptsById={RECEIPTS_BY_ID[1]}
          convertedReceipt
          transaction={TRANSACTIONS[1]}
          key={(TRANSACTIONS[0].receiptsOutcome || [])[1].id || "bbb"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Failure", () => {
    expect(
      renderer.create(
        <ReceiptRow
          convertedReceiptHash={
            (TRANSACTIONS[2].receiptsOutcome || [
              { id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222" },
            ])[0].id
          }
          receiptOutcomesById={RECEIPT_OUTCOMES_BY_ID[2]}
          receiptsById={RECEIPTS_BY_ID[2]}
          convertedReceipt
          transaction={TRANSACTIONS[2]}
          key={(TRANSACTIONS[1].receiptsOutcome || [])[0].id || "ccc"}
        />
      )
    ).toMatchSnapshot();
  });
});
