import renderer from "react-test-renderer";

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <AccountDetails
          account={{
            id: "account",
            amount: "14567898765434567876543",
            locked: "0",
            storageUsage: 876,
            storagePaidAt: 1,
            inTransactionsCount: 10,
            outTransactionsCount: 7,
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            accountIndex: 1234567890,
            storageAmountPerByte: "1000000000000000000000",
            lockupAccountId:
              "c3e5988357bc5ffe511fff286e03d05505a76bc1.lockup.near",
            lockupAmount: "5000000000000000000000000",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
