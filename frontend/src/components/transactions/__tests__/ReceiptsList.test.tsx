import renderer from "react-test-renderer";

import ReceiptsList from "../ReceiptsList";

import { TRANSACTIONS } from "./common";

describe("<ReceiptsList />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <ReceiptsList
          convertedReceiptHash={
            (TRANSACTIONS[0].receiptsOutcome &&
              TRANSACTIONS[0].receiptsOutcome[0].id) ||
            "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs"
          }
          receipts={TRANSACTIONS[0].receipts}
        />
      )
    ).toMatchSnapshot();
  });
});
