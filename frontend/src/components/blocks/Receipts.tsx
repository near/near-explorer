import React from "react";

import ReceiptsApi, { Receipt } from "../../libraries/explorer-wamp/receipts";

import ActionGroup from "../transactions/ActionGroup";
import Placeholder from "../utils/Placeholder";
import PaginationSpinner from "../utils/PaginationSpinner";
import ReceiptLink from "../utils/ReceiptLink";
import ExecutionReceiptStatus from "../utils/ExecutionReceiptStatus";

interface Props {
  blockHash: string;
}

export type ReceiptInfoProps = Props & Receipt;

class Receipts extends React.Component<ReceiptInfoProps> {
  state = {
    receipts: [],
    loading: true,
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
        this.setState({ receipts, loading: false });
      });
    }
    return null;
  };
  render() {
    const { receipts, loading } = this.state;

    return (
      <>
        {loading ? (
          <PaginationSpinner hidden={false} />
        ) : receipts?.length > 0 ? (
          receipts.map((receipt: Receipt, index) => (
            <ActionGroup
              key={`${receipt.receiptId}_${index}`}
              actionGroup={receipt as Receipt}
              detailsLink={
                <ReceiptLink
                  transactionHash={receipt.originatedFromTransactionHash}
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
