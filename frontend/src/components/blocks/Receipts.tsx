import React from "react";

import ReceiptsApi from "../../libraries/explorer-wamp/receipts";

class Receipts extends React.Component {
  state = {
    receipts: [],
  };
  componentDidMount() {
    this.fetchReceiptsList(this.props.blockHash);
  }

  componentDidUpdate(prevProps) {
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

    return <div>Hello</div>;
  }
}

export default Receipts;
