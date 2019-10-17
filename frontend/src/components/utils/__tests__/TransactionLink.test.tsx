import renderer from "react-test-renderer";

import TransactionLink from "../TransactionLink";

describe("<TransactionLink />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <TransactionLink transactionHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
