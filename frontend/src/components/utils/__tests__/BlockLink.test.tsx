import renderer from "react-test-renderer";

import BlockLink from "../BlockLink";

describe("<BlockLink />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <BlockLink blockHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
