import React from "react";

import ReceiptsApi, {
  DbReceiptInfo,
} from "../../libraries/explorer-wamp/receipts";

import ActionGroup from "../transactions/ActionGroup";
import Placeholder from "../utils/Placeholder";
import ReceiptLink from "../utils/ReceiptLink";
import ExecutionReceiptStatus from "../utils/ExecutionReceiptStatus";

interface Props {
  blockHash: string;
}

export type ReceiptInfoProps = Props & DbReceiptInfo;

class Receipts extends React.Component<ReceiptInfoProps> {
  state = {
    receipts: [],
  };
  componentDidMount() {
    this.fetchReceiptsList(this.props.blockHash);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.blockHash !== this.props.blockHash) {
      this.fetchReceiptsList(this.props.blockHash);
    }
  }

  fetchReceiptsList = (blockHash: string) => {
    if (blockHash) {
      new ReceiptsApi().queryReceiptsList(blockHash).then((receipts) => {
        this.setState({ receipts });
      });
    }
    return null;
  };
  render() {
    const { receipts } = this.state;

    return (
      <>
        {receipts && receipts.length > 0 ? (
          receipts.map((receipt: DbReceiptInfo, index) => (
            <ActionGroup
              key={`${receipt.receiptId}_${index}`}
              actionGroup={receipt as DbReceiptInfo}
              detailsLink={
                <ReceiptLink
                  transactionHash={receipt.includedInTransactionHash}
                  receiptId={receipt.receiptId}
                />
              }
              status={
                receipt.status ? (
                  <ExecutionReceiptStatus status={receipt.status} />
                ) : (
                  <>{"Fetching Status..."}</>
                )
              }
              title={"Batch Receipt"}
            />
          ))
        ) : (
          <Placeholder>There is no receipts</Placeholder>
        )}
      </>
    );
  }
}

export default Receipts;
