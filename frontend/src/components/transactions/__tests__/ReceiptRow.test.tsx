import * as React from "react";

import ReceiptRow from "@explorer/frontend/components/transactions/ReceiptRow";
import { renderElement } from "@explorer/frontend/testing/utils";

import {
  TRANSACTION_WITH_SUCCESSFUL_RECEIPT,
  TRANSACTION_WITH_MANY_RECEIPTS,
  TRANSACTION_WITH_FAILING_RECEIPT,
} from "./common";

describe("<ReceiptRow />", () => {
  it("renders successful receipt", () => {
    expect(
      renderElement(
        <ReceiptRow
          receipt={TRANSACTION_WITH_SUCCESSFUL_RECEIPT.receipt!}
          transactionHash={TRANSACTION_WITH_SUCCESSFUL_RECEIPT.hash}
          key={TRANSACTION_WITH_SUCCESSFUL_RECEIPT.receipt!.id}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders receipt with many outcome receipts", () => {
    expect(
      renderElement(
        <ReceiptRow
          receipt={TRANSACTION_WITH_MANY_RECEIPTS.receipt!}
          transactionHash={TRANSACTION_WITH_MANY_RECEIPTS.hash}
          key={TRANSACTION_WITH_MANY_RECEIPTS.receipt!.id}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Failure receipt", () => {
    expect(
      renderElement(
        <ReceiptRow
          receipt={TRANSACTION_WITH_FAILING_RECEIPT.receipt!}
          transactionHash={TRANSACTION_WITH_FAILING_RECEIPT.hash}
          key={TRANSACTION_WITH_FAILING_RECEIPT.receipt!.id}
        />
      )
    ).toMatchSnapshot();
  });
});
