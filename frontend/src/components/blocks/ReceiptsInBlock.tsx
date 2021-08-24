import { Component } from "react";

import ReceiptsApi, { Receipt } from "../../libraries/explorer-wamp/receipts";

import Receipts from "../receipts/Receipts";
import Placeholder from "../utils/Placeholder";
import PaginationSpinner from "../utils/PaginationSpinner";

import { Translate } from "react-localize-redux";

interface Props {
  blockHash: string;
}

interface State {
  receipts: Receipt[];
  loading: boolean;
}

class ReceiptsInBlock extends Component<Props, State> {
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

  fetchReceiptsList = (blockHash: string): void => {
    if (blockHash) {
      new ReceiptsApi().queryReceiptsList(blockHash).then((receipts) => {
        this.setState({ receipts, loading: false });
      });
    }
  };
  render() {
    const { receipts, loading } = this.state;

    return (
      <Translate>
        {({ translate }) => (
          <>
            {loading ? (
              <PaginationSpinner hidden={false} />
            ) : receipts.length > 0 ? (
              <Receipts receipts={receipts} />
            ) : (
              <Placeholder>
                {translate("component.blocks.ReceiptsInBlock.no_receipts")}
              </Placeholder>
            )}
          </>
        )}
      </Translate>
    );
  }
}

export default ReceiptsInBlock;
