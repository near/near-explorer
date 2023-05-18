import React from "react";

import TransactionLink from "@/frontend/components/utils/TransactionLink";
import { renderElement } from "@/frontend/testing/utils";

describe("<TransactionLink />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <TransactionLink transactionHash="H4CpspC1bqkykKG6dtCoGmLepvcyV2f2phfoqNAn5L2b" />
      )
    ).toMatchSnapshot();
  });
});
