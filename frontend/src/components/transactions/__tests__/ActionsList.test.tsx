import * as React from "react";

import ActionsList from "@/frontend/components/transactions/ActionsList";
import ReceiptLink from "@/frontend/components/utils/ReceiptLink";
import TransactionLink from "@/frontend/components/utils/TransactionLink";
import { renderElement } from "@/frontend/testing/utils";

import { TRANSACTIONS, RECEIPTS } from "./common";

describe("<ActionsList />", () => {
  it("renders sparsely by default for Transactions", () => {
    expect(
      renderElement(
        <ActionsList
          signerId={TRANSACTIONS[0].signerId}
          receiverId={TRANSACTIONS[0].receiverId}
          actions={TRANSACTIONS[0].actions}
          blockTimestamp={TRANSACTIONS[0].blockTimestamp}
          detailsLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders sparsely by default for Receipts", () => {
    expect(
      renderElement(
        <ActionsList
          signerId={RECEIPTS[1].signerId}
          receiverId={RECEIPTS[1].receiverId}
          blockTimestamp={RECEIPTS[1].blockTimestamp}
          actions={RECEIPTS[1].actions}
          detailsLink={
            <ReceiptLink
              transactionHash={RECEIPTS[1].originatedFromTransactionHash}
              receiptId={RECEIPTS[1].id}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for Transaction", () => {
    expect(
      renderElement(
        <ActionsList
          viewMode="compact"
          signerId={TRANSACTIONS[0].signerId}
          receiverId={TRANSACTIONS[0].receiverId}
          blockTimestamp={TRANSACTIONS[0].blockTimestamp}
          actions={TRANSACTIONS[0].actions}
          detailsLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for Receipts", () => {
    expect(
      renderElement(
        <ActionsList
          viewMode="compact"
          signerId={RECEIPTS[7].signerId}
          receiverId={RECEIPTS[7].receiverId}
          blockTimestamp={RECEIPTS[7].blockTimestamp}
          actions={RECEIPTS[7].actions}
          detailsLink={
            <ReceiptLink
              transactionHash={RECEIPTS[7].originatedFromTransactionHash}
              receiptId={RECEIPTS[7].id}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders functioncall by default", () => {
    expect(
      renderElement(
        <ActionsList
          signerId={TRANSACTIONS[1].signerId}
          receiverId={TRANSACTIONS[1].receiverId}
          blockTimestamp={TRANSACTIONS[1].blockTimestamp}
          actions={TRANSACTIONS[1].actions}
          detailsLink={
            <TransactionLink transactionHash={TRANSACTIONS[1].hash} />
          }
          showDetails
        />
      )
    ).toMatchSnapshot();
  });

  it("renders ActionsList for Receipts without transactionHash", () => {
    expect(
      <ActionsList
        signerId={RECEIPTS[0].signerId}
        receiverId={RECEIPTS[0].receiverId}
        blockTimestamp={RECEIPTS[0].blockTimestamp}
        actions={RECEIPTS[0].actions}
        detailsLink={
          <ReceiptLink
            transactionHash={RECEIPTS[0].originatedFromTransactionHash}
            receiptId={RECEIPTS[0].id}
          />
        }
        showDetails
      />
    ).toMatchSnapshot();
  });
});
