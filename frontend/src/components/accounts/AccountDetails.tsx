import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as A from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";

export interface Props {
  account: A.Account;
}

export default class extends React.Component<Props> {
  render() {
    const { account } = this.props;
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col md="3">
            <CardCell
              title="Ⓝ Balance"
              text={<Balance amount={account.amount} />}
              className="border-0"
              href={"https://docs.nearprotocol.com/docs/concepts/account"}
              termDescription={
                "Total NEAR token balance. This includes the 'Locked' balance."
              }
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Ⓝ Locked"
              text={<Balance amount={account.locked} />}
              href={"https://docs.nearprotocol.com/docs/concepts/account"}
              termDescription={
                "NEAR token balance that is currently staked, and thus not immediately spendable."
              }
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
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
              termDescription={
                "Total transaction sent and received by this account."
              }
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Storage Used"
              imgLink="/static/images/icon-storage.svg"
              text={`${account.storageUsage.toLocaleString()} B`}
              termDescription={
                "Total blockchain storage (in bytes) used by this account."
              }
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title="Created"
              text={moment(account.createdAtBlockTimestamp).format(
                "MMMM DD, YYYY [at] h:mm:ssa"
              )}
              className="block-card-created account-card-back border-0"
              href={"https://docs.nearprotocol.com/docs/concepts/account"}
              termDescription={"Timestamp of when this account was created."}
            />
          </Col>
          <Col md="8">
            <CardCell
              title="Creation Hash"
              text={
                account.createdByTransactionHash !== "Genesis" ? (
                  <TransactionLink
                    transactionHash={account.createdByTransactionHash}
                  >
                    {account.createdByTransactionHash}
                  </TransactionLink>
                ) : (
                  "from Genesis"
                )
              }
              className="block-card-created-text account-card-back border-0"
              href={"https://docs.nearprotocol.com/docs/concepts/transaction"}
              termDescription={
                "Unique identifier (hash) of the transaction that created this account."
              }
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
