import renderer from "react-test-renderer";

import BlocksBlock from "../DashboardBlocksBlock";

describe("<BlockDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <BlocksBlock
          block={{
            transactionsCount: 3,
            timestamp: Number(new Date(2019, 1, 1)),
            hash: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            prevHash: "EVvWW1S9BFaEjY1JBNSdstb7Zjghjlyguiygfhgu",
            height: 12345,
            gasPrice: "5000",
            gasUsed: 0,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
