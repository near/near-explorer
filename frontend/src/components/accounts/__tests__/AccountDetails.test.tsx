import renderer from "react-test-renderer";

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <AccountDetails
          account={{
            id: "account",
            timestamp: BigInt(1576888955222),
            amount: "1",
            locked: "1",
            storageUsage: 0,
            storagePaidAt: 1,
            inTransactionsCount: 0,
            outTransactionsCount: 0,
            address: "abcdefg"
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
