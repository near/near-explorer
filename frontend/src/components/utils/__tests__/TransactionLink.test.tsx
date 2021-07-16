import { renderI18nElement } from "../../../libraries/test";

import TransactionLink from "../TransactionLink";

describe("<TransactionLink />", () => {
  it("renders", () => {
    expect(
      renderI18nElement(
        <TransactionLink transactionHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
