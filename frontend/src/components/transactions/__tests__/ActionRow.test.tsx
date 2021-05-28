import renderer from "react-test-renderer";
import * as T from "../../../libraries/explorer-wamp/transactions";

import ExecutionStatus from "../../utils/ExecutionStatus";
import TransactionLink from "../../utils/TransactionLink";
import ReceiptHashLink from "../../utils/ReceiptHashLink";
import ActionRow from "../ActionRow";

import { RECEIPTS, TRANSACTIONS } from "./common";

describe("<ActionRow />", () => {
  it("renders sparsely ActionRow for transaction by default", () => {
    expect(
      renderer.create(
        <ActionRow
          actionBlock={TRANSACTIONS[0]}
          actionLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
          action={{
            kind: "CreateAccount",
            args: {},
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders sparsely ActionRow for transaction with status", () => {
    expect(
      renderer.create(
        <ActionRow
          actionBlock={TRANSACTIONS[0]}
          actionLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
          action={{
            kind: "CreateAccount",
            args: {},
          }}
          status={
            <ExecutionStatus
              status={TRANSACTIONS[0].status ?? "SuccessValue"}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders sparsely ActionRow for receipt", () => {
    expect(
      renderer.create(
        <ActionRow
          actionBlock={RECEIPTS[7]}
          action={RECEIPTS[7].actions[0]}
          actionLink={
            <ReceiptHashLink
              transactionHash={RECEIPTS[7].includedInTransactionHash}
              receiptId={RECEIPTS[7].receiptId}
            />
          }
          status={
            <ExecutionStatus
              status={TRANSACTIONS[0].status ?? "SuccessValue"}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for transaction", () => {
    expect(
      renderer.create(
        <ActionRow
          viewMode="compact"
          actionBlock={TRANSACTIONS[0]}
          actionLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
          action={{
            kind: "AddKey",
            args: {
              access_key: {
                nonce: 0,
                permission: "FullAccess",
              },
              public_key: "ed25519:8LXEySyBYewiTTLxjfF1TKDsxxxxxxxxxxxxxxxxxx",
            },
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for receipt", () => {
    expect(
      renderer.create(
        <ActionRow
          viewMode="compact"
          actionBlock={RECEIPTS[1]}
          action={RECEIPTS[1].actions[0]}
        />
      )
    ).toMatchSnapshot();
  });

  const actionFunctionCall = {
    kind: "FunctionCall",
    args: {
      args: "eyJ2YWx1ZSI6MX0=",
      deposit: "1",
      gas: 2000000000000,
      method_name: "incrementCounter",
    },
  } as T.Action;

  it("renders functioncall with detail", () => {
    expect(
      renderer.create(
        <ActionRow
          actionBlock={TRANSACTIONS[0]}
          action={actionFunctionCall}
          showDetails
        />
      )
    ).toMatchSnapshot();
  });
});
