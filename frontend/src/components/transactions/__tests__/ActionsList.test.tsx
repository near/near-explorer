import renderer from "react-test-renderer";

import ActionsList from "../ActionsList";
import TransactionLink from "../../utils/TransactionLink";
import ReceiptHashLink from "../../utils/ReceiptHashLink";

import { TRANSACTIONS, RECEIPTS } from "./common";

describe("<ActionsList />", () => {
  it("renders sparsely by default for Transactions", () => {
    expect(
      renderer.create(
        <ActionsList
          actionBlock={TRANSACTIONS[0]}
          actions={TRANSACTIONS[0].actions}
          actionLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders sparsely by default for Receipts", () => {
    expect(
      renderer.create(
        <ActionsList
          actionBlock={RECEIPTS[1]}
          actions={RECEIPTS[1].actions}
          actionLink={
            <ReceiptHashLink
              transactionHash={RECEIPTS[1].includedInTransactionHash}
              receiptId={RECEIPTS[1].receiptId}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for Transaction", () => {
    expect(
      renderer.create(
        <ActionsList
          viewMode="compact"
          actionBlock={TRANSACTIONS[0]}
          actions={TRANSACTIONS[0].actions}
          actionLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for Receipts", () => {
    expect(
      renderer.create(
        <ActionsList
          viewMode="compact"
          actionBlock={RECEIPTS[7]}
          actions={RECEIPTS[7].actions}
          actionLink={
            <ReceiptHashLink
              transactionHash={RECEIPTS[7].includedInTransactionHash}
              receiptId={RECEIPTS[7].receiptId}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders functioncall by default", () => {
    expect(
      renderer.create(
        <ActionsList
          actionBlock={TRANSACTIONS[1]}
          actions={TRANSACTIONS[1].actions}
          actionLink={
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
        actionBlock={RECEIPTS[0]}
        actions={RECEIPTS[0].actions}
        actionLink={
          <ReceiptHashLink
            transactionHash={RECEIPTS[0].includedInTransactionHash}
            receiptId={RECEIPTS[0].receiptId}
          />
        }
        showDetails
      />
    ).toMatchSnapshot();
  });
});
