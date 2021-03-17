import renderer from "react-test-renderer";

import ReceiptRow from "../ReceiptRow";

import { TRANSACTIONS } from "./common";

describe("<ReceiptRow />", () => {
  it("renders SuccessValue", () => {
    expect(
      renderer.create(
        <ReceiptRow
          convertedReceiptHash={
            (TRANSACTIONS[0].receiptsOutcome &&
              TRANSACTIONS[0].receiptsOutcome[0].id) ||
            "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs"
          }
          receipts={TRANSACTIONS[0].receipts}
          key={
            (TRANSACTIONS[0].receiptsOutcome &&
              TRANSACTIONS[0].receiptsOutcome[0].id) ||
            "aaa"
          }
          convertedReceipt
        />
      )
    ).toMatchSnapshot();
  });

  it("renders SuccessReceiptId", () => {
    expect(
      renderer.create(
        <ReceiptRow
          convertedReceiptHash={
            (TRANSACTIONS[1].receiptsOutcome &&
              TRANSACTIONS[1].receiptsOutcome[0].id) ||
            "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"
          }
          receipts={TRANSACTIONS[1].receipts}
          key={
            (TRANSACTIONS[1].receiptsOutcome &&
              TRANSACTIONS[1].receiptsOutcome[0].id) ||
            "bbb"
          }
          convertedReceipt
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Failure", () => {
    expect(
      renderer.create(
        <ReceiptRow
          convertedReceiptHash={
            (TRANSACTIONS[2].receiptsOutcome &&
              TRANSACTIONS[2].receiptsOutcome[0].id) ||
            "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"
          }
          receipts={TRANSACTIONS[2].receipts}
          key={
            (TRANSACTIONS[2].receiptsOutcome &&
              TRANSACTIONS[2].receiptsOutcome[0].id) ||
            "ccc"
          }
          convertedReceipt
        />
      )
    ).toMatchSnapshot();
  });
});
