import { renderElement } from "../../../testing/utils";

import BlockLink from "../BlockLink";

describe("<BlockLink />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <BlockLink blockHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
