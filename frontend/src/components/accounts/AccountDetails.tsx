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
  unlockupAmount?: string;
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
            unlockupAmount: lockupInfo.unlockupAmount,
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
    const { lockupAccountId, lockupAmount, unlockupAmount } = this.state;
    let minimumBalance = new BN(account.storageAmountPerByte)
      .mul(new BN(account.storageUsage))
      .toString();
    let availableBalance = new BN(account.amount)
      .sub(new BN(minimumBalance))
      .toString();
    let totalBalance;
    if (lockupAmount && unlockupAmount) {
      totalBalance = new BN(account.amount)
        .add(new BN(account.locked))
        .add(new BN(lockupAmount))
        .add(new BN(unlockupAmount))
        .toString();
    }
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Ⓝ Available Balance"}>
                  {
                    "This is your spendable NEAR balance, and can be used or transferred immediately. This will be lower than your Total Balance."
                  }
                </Term>
              }
              text={<Balance amount={availableBalance} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Minimum Balance"}>
                  {
                    "This is the minimum NEAR balance your account must maintain to remain active. This balance represents the storage space your account is using on the NEAR blockchain, and will go up or down as you use more or less space. "
                  }
                  <a
                    href={
                      "https://docs.near.org/docs/roles/integrator/faq#is-there-a-minimum-account-balance"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              imgLink="/static/images/icon-storage.svg"
              text={<Balance amount={minimumBalance} />}
            />
          </Col>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Storage Used"}>
                  {"Total blockchain storage (in bytes) used by this account. "}
                  <a href={"https://docs.near.org/docs/concepts/storage"}>
                    docs
                  </a>
                </Term>
              }
              imgLink="/static/images/icon-storage.svg"
              text={`${account.storageUsage.toLocaleString()} B`}
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
        </Row>
        {lockupAccountId && (
          <Row noGutters>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Ⓝ Total Balance"}>
                    {
                      "Your total balance represents all NEAR tokens under your control. In many cases, you will not have immediate access to this entire balance (e.g. if it is locked, delegated, or staked). Check your Available Balance for the NEAR you can actively use, transfer, delegate, and stake."
                    }
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
                      "This NEAR is locked in a lockup contract, and cannot be withdrawn. You may still delegate or stake this NEAR. Once the NEAR is unlocked, you can view it in your Unlocked Balance, and chose to withdraw it (moving to your Available Balance). "
                    }
                    <a
                      href={
                        "https://docs.near.org/docs/tokens/lockup#lockup-basics"
                      }
                    >
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
                  <Term title={"Ⓝ Staked Balance"}>
                    {
                      "This NEAR is actively being used to back a validator and secure the network. When you decide to unstake this NEAR, it will take some time to be shown in your Available Balance, as NEAR takes 3 epochs (~36 hours) to unstake. "
                    }
                    <a
                      href={
                        "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                      }
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
                  <Term title={"Lockup Account"}>
                    {
                      "Lockup is a special smart contract that ensures that the full amount or even a partial amount is not transferable until it is supposed to be. "
                    }
                    <a
                      href={
                        "https://docs.near.org/docs/tokens/lockup#the-lockup-contract"
                      }
                    >
                      docs
                    </a>
                  </Term>
                }
                imgLink="/static/images/icon-m-transaction.svg"
                text={<AccountLink accountId={lockupAccountId} />}
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
