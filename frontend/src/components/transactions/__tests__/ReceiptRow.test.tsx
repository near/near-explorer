import renderer from "react-test-renderer";

import ReceiptRow from "../ReceiptRow";

import { TRANSACTIONS } from "./common";

describe("<ReceiptRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <ReceiptRow receipt={(TRANSACTIONS[0].receipts || [])[0]} />
      )
    ).toMatchSnapshot();
  });
});
