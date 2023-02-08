import { renderElement } from "@explorer/frontend/testing/utils";

import BlockLink from "@explorer/frontend/components/utils/BlockLink";

describe("<BlockLink />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <BlockLink blockHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
