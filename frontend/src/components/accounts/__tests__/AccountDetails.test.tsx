import { renderElement } from "../../../testing/utils";

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  beforeEach(() => jest.resetAllMocks());

  it("renders with account created at genesis (legacy)", () => {
    expect(
      renderElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash: "Genesis",
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
            stakedBalance: "0",
            nonStakedBalance: "654345665432345678765",
            storageUsage: "876",
            lockupAccountId: "gjturigjgkjnfidsjffjsa.lockup.near",
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with account created at genesis", () => {
    expect(
      renderElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: null,
            createdByTransactionHash: null,
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
            stakedBalance: "0",
            nonStakedBalance: "654345665432345678765",
            storageUsage: "876",
            lockupAccountId: "gjturigjgkjnfidsjffjsa.lockup.near",
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with account deletion at", () => {
    expect(
      renderElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: null,
            createdByTransactionHash: null,
            deletedAtBlockTimestamp: Number(new Date(2019, 1, 2)),
            deletedByTransactionHash:
              "3RAqiv3SzjmtMT3ncqU96q1efRm67YT6gxtS7hhPvADp",
            stakedBalance: "0",
            nonStakedBalance: "654345665432345678765",
            storageUsage: "876",
            lockupAccountId: "gjturigjgkjnfidsjffjsa.lockup.near",
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with lockup account", () => {
    expect(
      renderElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
            stakedBalance: "0",
            nonStakedBalance: "654345665432345678765",
            storageUsage: "876",
            lockupAccountId: "gjturigjgkjnfidsjffjsa.lockup.near",
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders without lockup account", () => {
    expect(
      renderElement(
        <AccountDetails
          account={{
            accountId: "near.near",
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFlkjkmnjmkb7ZTtTFjQ6cygkbw1KY4tL",
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
            stakedBalance: "0",
            nonStakedBalance: "6987876845678765",
            storageUsage: "1876",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
