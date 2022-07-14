import JSBI from "jsbi";
import * as React from "react";
import { styled } from "../../../libraries/styles";
import * as BI from "../../../libraries/bigint";
import { trpc } from "../../../libraries/trpc";

import { Action, TransactionReceipt } from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";
import Gas from "../../utils/Gas";
import AccountLink from "../common/AccountLink";
import BlockLink from "../common/BlockLink";

type Props = {
  receipt: TransactionReceipt;
};

const Table = styled("table", {
  width: "100%",
  marginVertical: 24,
});

const TableElement = styled("td", {
  color: "#000000",
  fontSize: 14,
  lineHeight: "175%",
});

const BalanceTitle = styled("div", {
  marginTop: 36,
  fontWeight: 600,
});

const BalanceAmount = styled("div", {
  color: "#1A8300",
});

const getDeposit = (actions: Action[]): JSBI => {
  return actions
    .map((action) =>
      "deposit" in action.args ? JSBI.BigInt(action.args.deposit) : BI.zero
    )
    .reduce((accumulator, deposit) => JSBI.add(accumulator, deposit), BI.zero);
};

const InspectReceipt: React.FC<Props> = React.memo(
  ({ receipt: { id, ...receipt } }) => {
    const { data: predecessorBalance } = trpc.useQuery([
      "transaction.accountBalanceChange",
      { accountId: receipt.predecessorId, receiptId: id },
    ]);
    const { data: receiverBalance } = trpc.useQuery([
      "transaction.accountBalanceChange",
      { accountId: receipt.receiverId, receiptId: id },
    ]);

    const refund =
      receipt.outcome.nestedReceipts
        .filter((receipt) => receipt.predecessorId === "system")
        ?.reduce(
          (acc, receipt) => JSBI.add(acc, getDeposit(receipt.actions)),
          BI.zero
        )
        .toString() ?? "0";

    return (
      <Table>
        <tr>
          <TableElement>Receipt ID</TableElement>
          <TableElement>{id}</TableElement>
        </tr>
        <tr>
          <TableElement>Executed in Block</TableElement>
          <TableElement>
            <BlockLink
              blockHash={receipt.outcome.block.hash}
              blockHeight={receipt.outcome.block.height}
            />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Predecessor ID</TableElement>
          <TableElement>
            <AccountLink accountId={receipt.predecessorId} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Receiver ID</TableElement>
          <TableElement>
            <AccountLink accountId={receipt.receiverId} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Attached Gas</TableElement>
          <TableElement>
            {receipt.actions[0].kind === "functionCall" ? (
              <Gas gas={JSBI.BigInt(receipt.actions[0].args.gas)} />
            ) : (
              "-"
            )}
          </TableElement>
        </tr>
        <tr>
          <TableElement>Gas Burned</TableElement>
          <TableElement>
            <Gas gas={JSBI.BigInt(receipt.outcome.gasBurnt || 0)} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Tokens Burned</TableElement>
          <TableElement>
            <NearAmount
              amount={receipt.outcome.tokensBurnt}
              decimalPlaces={2}
            />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Refunded</TableElement>
          <TableElement>
            {refund ? <NearAmount amount={refund} decimalPlaces={2} /> : "0"}
          </TableElement>
        </tr>
        <tr>
          <TableElement colSpan={2}>
            <BalanceTitle>New Balance</BalanceTitle>
          </TableElement>
        </tr>
        <tr>
          <TableElement>
            <AccountLink accountId={receipt.predecessorId} />
          </TableElement>
          <TableElement>
            <BalanceAmount>
              {predecessorBalance ? (
                <NearAmount amount={predecessorBalance} decimalPlaces={2} />
              ) : (
                "-"
              )}
            </BalanceAmount>
          </TableElement>
        </tr>
        <tr>
          <TableElement>
            <AccountLink accountId={receipt.receiverId} />
          </TableElement>
          <TableElement>
            <BalanceAmount>
              {receiverBalance ? (
                <NearAmount amount={receiverBalance} decimalPlaces={2} />
              ) : (
                "-"
              )}
            </BalanceAmount>
          </TableElement>
        </tr>
      </Table>
    );
  }
);

export default InspectReceipt;
