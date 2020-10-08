import moment from "moment";
import BN from "bn.js";

import React from "react";

import { Row, Col } from "react-bootstrap";

import AccountsApi, * as A from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";

export interface Props {
  account: A.Account;
}

interface State {
  lockupAccountId?: string;
  lockupAmount?: string;
  lockupTimestamp?: number;
}
export default class extends React.Component<Props, State> {
  state: State = {};

  collectLockupInfo = async () => {
    new AccountsApi()
      .queryLockupAccountInfo(this.props.account.id)
      .then((lockupInfo) => {
        if (lockupInfo) {
          this.setState({
            lockupAccountId: lockupInfo.lockupAccountId,
            lockupAmount: lockupInfo.lockupAmount,
            lockupTimestamp: lockupInfo.lockupTimestamp,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.collectLockupInfo();
  }

  render() {
    const { account } = this.props;
    const { lockupAccountId, lockupAmount, lockupTimestamp } = this.state;
    let totalBalance;
    if (lockupAmount) {
      totalBalance = new BN(account.amount)
        .add(new BN(lockupAmount))
        .toString();
    }
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Ⓝ Balance"}>
                  {"NEAR token that is spendable all the time. "}
                  <a href={"https://docs.near.org/docs/concepts/account"}>
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
                <Term title={"Ⓝ Staked Balance"}>
                  {
                    "NEAR token balance that is currently staked, and thus not immediately spendable. "
                  }
                  <a href={"https://docs.near.org/docs/concepts/account"}>
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
                  <a href={"https://docs.near.org/docs/concepts/transaction"}>
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
        {lockupAccountId && (
          <Row noGutters>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Ⓝ Total Balance"}>
                    {"NEAR token that is spendable all the time. "}
                    <a href={"https://docs.near.org/docs/concepts/account"}>
                      docs
                    </a>
                  </Term>
                }
                text={<Balance amount={totalBalance} />}
                className="border-0"
              />
            </Col>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Ⓝ Lockup Balance"}>
                    {
                      "NEAR token balance that is currently staked, and thus not immediately spendable. "
                    }
                    <a href={"https://docs.near.org/docs/concepts/account"}>
                      docs
                    </a>
                  </Term>
                }
                text={<Balance amount={lockupAmount} />}
              />
            </Col>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Lockup Account"}>
                    {"Total transaction sent and received by this account. "}
                    <a href={"https://docs.near.org/docs/concepts/transaction"}>
                      docs
                    </a>
                  </Term>
                }
                imgLink="/static/images/icon-m-transaction.svg"
                text={<AccountLink accountId={lockupAccountId} />}
              />
            </Col>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Lockup start time"}>
                    {
                      "Total blockchain storage (in bytes) used by this account. "
                    }
                  </Term>
                }
                imgLink="/static/images/icon-storage.svg"
                text={moment(lockupTimestamp).format(
                  "MMMM DD, YYYY [at] h:mm:ssa"
                )}
              />
            </Col>
          </Row>
        )}
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title={
                <Term title={"Created"}>
                  {"Timestamp of when this account was created. "}
                  <a href={"https://docs.near.org/docs/concepts/account"}>
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
                  <a href={"https://docs.near.org/docs/concepts/transaction"}>
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
