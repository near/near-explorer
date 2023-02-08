import BlockLink from "@explorer/frontend/components/utils/BlockLink";
import { renderElement } from "@explorer/frontend/testing/utils";

describe("<BlockLink />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <BlockLink blockHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
