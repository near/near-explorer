import React from "react";

import ReceiptsApi, {
  ReceiptInfo,
} from "../../libraries/explorer-wamp/receipts";

import ActionGroup from "../transactions/ActionGroup";
import Placeholder from "../utils/Placeholder";

interface Props {
  receiptId: string;
  blockHash: string;
}

export type ReceiptInfoProps = Props & ReceiptInfo;

class Receipts extends React.Component<Props> {
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
    console.log("Receipts", this.state.receipts);
    const { receipts } = this.state;

    return (
      <>
        {receipts && receipts.length > 0 ? (
          receipts.map((receipt: ReceiptInfoProps, index) => (
            <ActionGroup
              key={`${receipt.receiptId}_${index}`}
              actionGroup={receipt}
              status={receipt.status}
              title={"Batch Receipt"}
            />
          ))
        ) : (
          <Placeholder text="There is no receipts" />
        )}
      </>
    );
  }
}

export default Receipts;
