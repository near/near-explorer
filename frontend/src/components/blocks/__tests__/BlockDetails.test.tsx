import BN from "bn.js";

import renderer from "react-test-renderer";

import BlockDetails from "../BlockDetails";

describe("<BlockDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <BlockDetails
          block={{
            authorAccountId: "near.near",
            transactionsCount: 3,
            timestamp: Number(new Date(2019, 1, 1)),
            hash: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            prevHash: "EVvWW1S9BFaEjY1JBNSdstb7Zjghjlyguiygfhgu",
            height: 12345,
            gasPrice: new BN("5000"),
            gasUsed: new BN("1000"),
            totalSupply: new BN(10).pow(new BN(24 + 9)),
            receiptsCount: 5,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
