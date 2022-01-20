import { renderElement } from "../../../testing/utils";

import TransactionLink from "../TransactionLink";

describe("<TransactionLink />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <TransactionLink transactionHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
