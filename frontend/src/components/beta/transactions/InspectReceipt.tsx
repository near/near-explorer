import BN from "bn.js";
import * as React from "react";
import { styled } from "../../../libraries/styles";
import { formatNear } from "../../../libraries/formatting";
import { RefundReceipt, TransactionReceipt } from "../../../types/transaction";

import Gas from "../../utils/Gas";

type Props = {
  receipt: TransactionReceipt;
  refundReceipt: RefundReceipt;
};

const Table = styled("table", {
  width: "100%",
  margin: "0 80px",
});

const TableElement = styled("td", {
  color: "#000000",
  fontSize: 15,
  lineHeight: "40px",
});

const InspectReceipt: React.FC<Props> = React.memo(
  ({ receipt, refundReceipt }) => {
    return (
      <Table>
        <tr>
          <TableElement>Receipt ID</TableElement>
          <TableElement>{receipt.receiptId}</TableElement>
        </tr>
        <tr>
          <TableElement>Executed in Block</TableElement>
          <TableElement>--</TableElement>
        </tr>
        <tr>
          <TableElement>Predecessor ID</TableElement>
          <TableElement>{receipt.signerId}</TableElement>
        </tr>
        <tr>
          <TableElement>Receiver ID</TableElement>
          <TableElement>{receipt.receiverId}</TableElement>
        </tr>
        <tr>
          <TableElement>Attached Gas</TableElement>
          <TableElement>
            {"args" in receipt.actions[0] &&
            "gas" in receipt.actions[0].args ? (
              <Gas gas={new BN(receipt.actions[0].args?.gas)} />
            ) : (
              "-"
            )}
          </TableElement>
        </tr>
        <tr>
          <TableElement>Gas Burned</TableElement>
          <TableElement>
            <Gas gas={new BN(receipt.gasBurnt || 0)} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Tokens Burned</TableElement>
          <TableElement>{formatNear(receipt.tokensBurnt)}</TableElement>
        </tr>
        <tr>
          <TableElement>Refunded</TableElement>
          <TableElement>
            {refundReceipt.refund ? formatNear(refundReceipt.refund) : "0"}
          </TableElement>
        </tr>
      </Table>
    );
  }
);

export default InspectReceipt;
