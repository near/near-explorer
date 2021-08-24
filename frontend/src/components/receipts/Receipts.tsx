import { Component } from "react";

import { Receipt } from "../../libraries/explorer-wamp/receipts";

import ActionGroup from "../transactions/ActionGroup";
import ReceiptLink from "../utils/ReceiptLink";
import ReceiptExecutionStatus from "./ReceiptExecutionStatus";

interface Props {
  receipts: Receipt[];
}

class Receipts extends Component<Props> {
  render() {
    return (
      <>
        {this.props.receipts.map((receipt: Receipt, index) => (
          <ActionGroup
            key={`${receipt.receiptId}_${index}`}
            actionGroup={receipt}
            detailsLink={
              <ReceiptLink
                transactionHash={receipt.originatedFromTransactionHash}
                receiptId={receipt.receiptId}
              />
            }
            status={
              receipt.status ? (
                <ReceiptExecutionStatus status={receipt.status} />
              ) : (
                <>{"Fetching Status..."}</>
              )
            }
            title={"Batch Receipt"}
          />
        ))}
      </>
    );
  }
}

export default Receipts;
