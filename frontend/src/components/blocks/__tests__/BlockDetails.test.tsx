import renderer from "react-test-renderer";

import BlockDetails from "../BlockDetails";

describe("<BlockDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <BlockDetails
          block={{
            transactions_count: 3,
            timestamp: Number(new Date(2019, 1, 1)),
            hash: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            prev_hash: "EVvWW1S9BFaEjY1JBNSdstb7Zjghjlyguiygfhgu",
            height: 12345,
            gas_price: "5000",
            gasUsed: "1000",
            isFinal: true,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
