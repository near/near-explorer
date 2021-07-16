import { renderI18nElement } from "../../../libraries/tester";

import BlockLink from "../BlockLink";

describe("<BlockLink />", () => {
  it("renders", () => {
    expect(
      renderI18nElement(
        <BlockLink blockHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
