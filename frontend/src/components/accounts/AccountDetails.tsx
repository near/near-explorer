import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as A from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";

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
                <Term title={"Ⓝ Available Balance"}>
                  {
                    "This is your spendable NEAR balance, and can be used or transferred immediately. This will be lower than your Total Balance."
                  }
                </Term>
              }
              text={<Balance amount={account.availableBalance} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title={
                <Term title={"Ⓝ Total Balance"}>
                  {
                    "Your total balance represents all NEAR tokens under your control. In many cases, you will not have immediate access to this entire balance (e.g. if it is locked, delegated, or staked). Check your Available Balance for the NEAR you can actively use, transfer, delegate, and stake."
                  }
                </Term>
              }
              text={<Balance amount={account.totalBalance} />}
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
        <Row noGutters>
          <Col md="4">
            <CardCell
              title={
                <Term title={"Ⓝ Non-Staked Balance"}>
                  {
                    "The amount of NEAR Token that can be used for stake, covering storage, transfers, delegation, etc."
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
              text={<Balance amount={account.nonStakedBalance} />}
              className="border-0"
            />
          </Col>
          <Col md="4">
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
              text={<Balance amount={account.stakedBalance} />}
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term title={"Ⓝ Minimum Balance"}>
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
              text={<Balance amount={account.minimumBalance} />}
            />
          </Col>
        </Row>
        {account.lockupTotalBalance && (
          <Row noGutters>
            <Col md="4">
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
                text={
                  account.lockupAccountId ? (
                    <AccountLink accountId={account.lockupAccountId} />
                  ) : (
                    ""
                  )
                }
                className="border-0"
              />
            </Col>
            <Col md="4">
              <CardCell
                title={
                  <Term title={"Ⓝ Total Lockup Balance"}>
                    {
                      "This NEAR is in a lockup contract, and has restrictions on how it can be used. You may still delegate or stake this NEAR. Once the NEAR is unlocked, you can view it in your Unlocked Balance, and chose to withdraw it (moving to your Available Balance). "
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
                text={<Balance amount={account.lockupTotalBalance} />}
              />
            </Col>
            <Col md="4">
              <CardCell
                title={
                  <Term title={"Ⓝ Unlocked Lockup Balance"}>
                    {
                      "This NEAR is still in a lockup contract, and is ready to be withdrawn. If you choose to withdraw this NEAR, it will appear in your Available Balance. "
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
                text={<Balance amount={account.lockupUnlockedBalance} />}
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
                  : "N/A"
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
                  "N/A"
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
