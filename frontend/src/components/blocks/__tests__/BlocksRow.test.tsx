import renderer from "react-test-renderer";

import BlocksRow from "../BlocksRow";

describe("<BlocksRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <BlocksRow
          block={{
            transactions_count: 3,
            timestamp: Number(new Date(2019, 1, 1)),
            hash: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            prev_hash: "EVvWW1S9BFaEjY1JBNSdstb7Zjghjlyguiygfhgu",
            height: 12345,
            gas_price: "5000",
            isFinal: false,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
