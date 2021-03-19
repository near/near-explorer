import renderer from "react-test-renderer";

import ReceiptRow from "../ReceiptRow";

import { TRANSACTIONS } from "./common";

describe("<ReceiptRow />", () => {
  it("renders SuccessValue", () => {
    expect(
      renderer.create(
        <ReceiptRow
          receipt={TRANSACTIONS[0].receipt!}
          key={TRANSACTIONS[0].receipt!.receipt_id}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders SuccessReceiptId", () => {
    expect(
      renderer.create(
        <ReceiptRow
          receipt={TRANSACTIONS[1].receipt!}
          key={TRANSACTIONS[1].receipt!.receipt_id}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Failure", () => {
    expect(
      renderer.create(
        <ReceiptRow
          receipt={TRANSACTIONS[2].receipt!}
          key={TRANSACTIONS[2].receipt!.receipt_id}
        />
      )
    ).toMatchSnapshot();
  });
});
