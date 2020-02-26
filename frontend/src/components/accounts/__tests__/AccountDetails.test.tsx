import renderer from "react-test-renderer";

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <AccountDetails
          account={{
            id: "account",
            amount: "1",
            locked: "1",
            storageUsage: 0,
            storagePaidAt: 1,
            inTransactionsCount: 0,
            outTransactionsCount: 0,
            timestamp: Number(new Date(2019, 1, 1)),
            address: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL"
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
