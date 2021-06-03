import renderer from "react-test-renderer";

import ActionsList from "../ActionsList";
import TransactionLink from "../../utils/TransactionLink";
import ReceiptLink from "../../utils/ReceiptLink";

import { TRANSACTIONS, RECEIPTS } from "./common";

describe("<ActionsList />", () => {
  it("renders sparsely by default for Transactions", () => {
    expect(
      renderer.create(
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
      renderer.create(
        <ActionsList
          signerId={RECEIPTS[1].signerId}
          receiverId={RECEIPTS[1].receiverId}
          blockTimestamp={RECEIPTS[1].blockTimestamp}
          actions={RECEIPTS[1].actions}
          detailsLink={
            <ReceiptLink
              transactionHash={RECEIPTS[1].originatedFromTransactionHash}
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
      renderer.create(
        <ActionsList
          viewMode="compact"
          signerId={RECEIPTS[7].signerId}
          receiverId={RECEIPTS[7].receiverId}
          blockTimestamp={RECEIPTS[7].blockTimestamp}
          actions={RECEIPTS[7].actions}
          detailsLink={
            <ReceiptLink
              transactionHash={RECEIPTS[7].originatedFromTransactionHash}
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
            receiptId={RECEIPTS[0].receiptId}
          />
        }
        showDetails
      />
    ).toMatchSnapshot();
  });
});
