import renderer from "react-test-renderer";

import ReceiptRow from "../ReceiptRow";

import { TRANSACTIONS } from "./common";

describe("<ReceiptRow />", () => {
  it("renders SucessValue", () => {
    expect(
      renderer.create(
        <ReceiptRow
          receipt={(TRANSACTIONS[0].receiptsOutcome || [])[0]}
          key={(TRANSACTIONS[0].receiptsOutcome || [])[0].id || "aaa"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders SucessReceiptId", () => {
    expect(
      renderer.create(
        <ReceiptRow
          receipt={(TRANSACTIONS[0].receiptsOutcome || [])[1]}
          key={(TRANSACTIONS[0].receiptsOutcome || [])[1].id || "bbb"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Failure", () => {
    expect(
      renderer.create(
        <ReceiptRow
          receipt={(TRANSACTIONS[1].receiptsOutcome || [])[0]}
          key={(TRANSACTIONS[1].receiptsOutcome || [])[0].id || "ccc"}
        />
      )
    ).toMatchSnapshot();
  });
});
