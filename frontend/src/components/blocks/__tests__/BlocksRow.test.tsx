import renderer from "react-test-renderer";

import BlocksRow from "../BlocksRow";

describe("<BlocksRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <BlocksRow
          block={{
            transactionsCount: 3,
            timestamp: Number(new Date(2019, 1, 1)),
            hash: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            prevHash: "EVvWW1S9BFaEjY1JBNSdstb7Zjghjlyguiygfhgu",
            height: 12345,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
