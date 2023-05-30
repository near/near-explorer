import * as React from "react";

import JSBI from "jsbi";

import { BlockDetails } from "@/frontend/components/blocks/BlockDetails";
import { renderElement } from "@/frontend/testing/utils";

describe("<BlockDetails />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <BlockDetails
          block={{
            authorAccountId: "near.near",
            transactionsCount: 3,
            timestamp: Number(new Date(2019, 1, 1)),
            hash: "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            prevHash: "EVvWW1S9BFaEjY1JBNSdstb7Zjghjlyguiygfhgu",
            height: 12345,
            gasPrice: "5000",
            gasUsed: "1000",
            totalSupply: JSBI.exponentiate(
              JSBI.BigInt(10),
              JSBI.BigInt(24 + 9)
            ).toString(),
            receiptsCount: 5,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
