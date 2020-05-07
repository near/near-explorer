import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as A from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";
import Term from "../utils/Term";

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
              title={
                <Term title={"Ⓝ Balance"}>
                  {"NEAR token that is spendable all the time. "}
                  <a
                    href={"https://docs.nearprotocol.com/docs/concepts/account"}
                  >
                    docs
                  </a>
                </Term>
              }
              text={<Balance amount={account.amount} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Ⓝ Locked"}>
                  {
                    "NEAR token balance that is currently staked, and thus not immediately spendable. "
                  }
                  <a
                    href={"https://docs.nearprotocol.com/docs/concepts/account"}
                  >
                    docs
                  </a>
                </Term>
              }
              text={<Balance amount={account.locked} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Transactions"}>
                  {"Total transaction sent and received by this account. "}
                  <a
                    href={
                      "https://docs.nearprotocol.com/docs/concepts/transaction"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
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
          <Col md="3">
            <CardCell
              title={
                <Term title={"Storage Used"}>
                  {"Total blockchain storage (in bytes) used by this account. "}
                </Term>
              }
              imgLink="/static/images/icon-storage.svg"
              text={`${account.storageUsage.toLocaleString()} B`}
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title={
                <Term title={"Created"}>
                  {"Timestamp of when this account was created. "}
                  <a
                    href={"https://docs.nearprotocol.com/docs/concepts/account"}
                  >
                    docs
                  </a>
                </Term>
              }
              text={
                account.createdAtBlockTimestamp
                  ? moment(account.createdAtBlockTimestamp).format(
                      "MMMM DD, YYYY [at] h:mm:ssa"
                    )
                  : ""
              }
              className="block-card-created account-card-back border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title={
                <Term title={"Creation Hash"}>
                  {
                    "Unique identifier (hash) of the transaction that created this account. "
                  }
                  <a
                    href={
                      "https://docs.nearprotocol.com/docs/concepts/transaction"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              text={
                account.createdByTransactionHash ? (
                  account.createdByTransactionHash !== "Genesis" ? (
                    <TransactionLink
                      transactionHash={account.createdByTransactionHash}
                    >
                      {account.createdByTransactionHash}
                    </TransactionLink>
                  ) : (
                    "from Genesis"
                  )
                ) : (
                  ""
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
