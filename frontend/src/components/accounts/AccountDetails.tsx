import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as A from "../../libraries/explorer-wamp/accounts";
import BlocksApi from "../../libraries/explorer-wamp/blocks";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";
import BlockLink from "../utils/BlockLink";

export interface Props {
  account: A.Account;
}

interface State {
  storagePaidAtBlockHash: string | null;
}

export default class extends React.Component<Props, State> {
  state: State = {
    storagePaidAtBlockHash: null
  };

  fetchBlockHash = async (height: string) => {
    new BlocksApi()
      .getBlockInfo(height)
      .then(block => this.setState({ storagePaidAtBlockHash: block.hash }))
      .catch(err => console.error(err));
  };

  componentDidUpdate(preProps: Props) {
    if (this.props.account !== preProps.account) {
      this.fetchBlockHash(this.props.account.storagePaidAt.toString());
    }
  }
  componentDidMount() {
    this.fetchBlockHash(this.props.account.storagePaidAt.toString());
  }

  render() {
    const { account } = this.props;
    const { storagePaidAtBlockHash } = this.state;
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col md="2">
            <CardCell
              title="Ⓝ Balance"
              text={<Balance amount={account.amount} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Transactions"
              imgLink="/static/images/icon-m-transaction.svg"
              text={
                <>
                  <span>
                    &uarr;{account.outTransactionsCount.toLocaleString()}
                  </span>
                  &nbsp;&nbsp;
                  <span>
                    &darr;{account.inTransactionsCount.toLocaleString()}
                  </span>
                </>
              }
            />
          </Col>
          <Col md="2">
            <CardCell
              title="Locked"
              imgLink="/static/images/icon-m-filter.svg"
              text={<Balance amount={account.locked} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Storage Used (Bytes)"
              imgLink="/static/images/icon-storage.svg"
              text={`${account.storageUsage.toLocaleString()} B`}
            />
          </Col>
          <Col md="2">
            <CardCell
              title="Last Paid"
              imgLink="/static/images/icon-m-block.svg"
              text={
                storagePaidAtBlockHash ? (
                  <BlockLink blockHash={storagePaidAtBlockHash}>
                    {`#${account.storagePaidAt.toLocaleString()}`}
                  </BlockLink>
                ) : (
                  `#${account.storagePaidAt.toLocaleString()}`
                )
              }
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="5">
            <CardCell
              title="Created"
              text={
                typeof account.timestamp === "number"
                  ? moment(account.timestamp).format(
                      "MMMM DD, YYYY [at] h:mm:ssa"
                    )
                  : account.timestamp
              }
              className="block-card-created account-card-back border-0"
            />
          </Col>
          <Col md="7">
            <CardCell
              title="Creation Hash"
              text={
                account.address === "" ? (
                  ""
                ) : (
                  <TransactionLink transactionHash={account.address}>
                    {account.address}
                  </TransactionLink>
                )
              }
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
        </Row>
        <style jsx global>{`
          .account-info-container {
            border: solid 4px #e6e6e6;
            border-radius: 4px;
          }

          .account-info-container > .row:first-of-type .card-cell-text {
            font-size: 24px;
          }

          .account-info-container > .row {
            border-bottom: 2px solid #e6e6e6;
          }

          .account-card-back {
            background-color: #f8f8f8;
          }
        `}</style>
      </div>
    );
  }
}
