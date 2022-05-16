import JSBI from "jsbi";
import * as React from "react";
import { styled } from "../../../libraries/styles";
import * as BI from "../../../libraries/bigint";
import { TransactionReceipt } from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";
import Gas from "../../utils/Gas";
import AccountLink from "../common/AccountLink";
import BlockLink from "../common/BlockLink";

type Props = {
  receipt: TransactionReceipt;
  refundReceipts?: TransactionReceipt[];
};

const Table = styled("table", {
  width: "100%",
  fontFamily: "SF Mono",
  marginVertical: 24,
});

const TableElement = styled("td", {
  color: "#000000",
  fontSize: "$font-s",
  lineHeight: "20px",
});

const InspectReceipt: React.FC<Props> = React.memo(
  ({ receipt, refundReceipts }) => {
    const refund =
      refundReceipts
        ?.reduce(
          (acc, receipt) => JSBI.add(acc, JSBI.BigInt(receipt.deposit || 0)),
          BI.zero
        )
        .toString() ?? "0";

    return (
      <Table>
        <tr>
          <TableElement>Receipt ID</TableElement>
          <TableElement>{receipt.receiptId}</TableElement>
        </tr>
        <tr>
          <TableElement>Executed in Block</TableElement>
          <TableElement>
            <BlockLink block={receipt.includedInBlock} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Predecessor ID</TableElement>
          <TableElement>
            <AccountLink accountId={receipt.signerId} />
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
            {"args" in receipt.actions[0] &&
            "gas" in receipt.actions[0].args ? (
              <Gas gas={JSBI.BigInt(receipt.actions[0].args?.gas)} />
            ) : (
              "-"
            )}
          </TableElement>
        </tr>
        <tr>
          <TableElement>Gas Burned</TableElement>
          <TableElement>
            <Gas gas={JSBI.BigInt(receipt.gasBurnt || 0)} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Tokens Burned</TableElement>
          <TableElement>
            <NearAmount amount={receipt.tokensBurnt} decimalPlaces={2} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Refunded</TableElement>
          <TableElement>
            {refund ? <NearAmount amount={refund} decimalPlaces={2} /> : "0"}
          </TableElement>
        </tr>
      </Table>
    );
  }
);

export default InspectReceipt;
