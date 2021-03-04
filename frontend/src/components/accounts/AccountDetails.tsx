import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as A from "../../libraries/explorer-wamp/accounts";
import { NearNetwork } from "../../libraries/config";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import TransactionLink from "../utils/TransactionLink";
import WalletLink from "../utils/WalletLink";

export interface Props {
  account: A.Account;
  currentNearNetwork: NearNetwork;
}

class AccountDetails extends React.Component<Props> {
  render() {
    const { account, currentNearNetwork } = this.props;
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col
            xs="12"
            md={typeof account.storageUsage === "undefined" ? "12" : "4"}
          >
            <CardCell
              title={
                <Term
                  title={"Transactions"}
                  text={"Total transaction sent and received by this account. "}
                  href={"https://docs.near.org/docs/concepts/transaction"}
                />
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
              className="border-0"
            />
          </Col>
          {typeof account.storageUsage !== "undefined" && (
            <Col xs="12" md={account.lockupAccountId ? "4" : "8"}>
              <CardCell
                title={
                  <Term
                    title={"Storage Used"}
                    text={
                      "Total blockchain storage (in bytes) used by this account. "
                    }
                    href={"https://docs.near.org/docs/concepts/storage-staking"}
                  />
                }
                imgLink="/static/images/icon-storage.svg"
                text={`${account.storageUsage.toLocaleString()} B`}
              />
            </Col>
          )}
          {account.lockupAccountId && (
            <Col xs="12" md="4">
              <CardCell
                title={
                  <Term
                    title={"Lockup Account"}
                    text={
                      "Lockup is a special smart contract that ensures that the full amount or even a partial amount is not transferable until it is supposed to be. "
                    }
                    href={
                      "https://docs.near.org/docs/tokens/lockup#the-lockup-contract"
                    }
                  />
                }
                imgLink="/static/images/icon-m-transaction.svg"
                text={
                  account.lockupAccountId ? (
                    <AccountLink accountId={account.lockupAccountId} />
                  ) : (
                    ""
                  )
                }
              />
            </Col>
          )}
        </Row>
        {typeof account.nonStakedBalance !== "undefined" && (
          <Row noGutters>
            <Col xs="12" md="4">
              <CardCell
                title={
                  <Term
                    title={"Ⓝ Native Account Balance"}
                    text={
                      'NEAR protocol defines a liquid balance for every account, this is directly used to pay for transactions issued by this account, but it is not the "total" balance of all the tokens you may control through this account; see "Aggregated Balace" for more details. '
                    }
                    href={
                      "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                    }
                  />
                }
                text={<Balance amount={account.nonStakedBalance} />}
                className="border-0"
              />
            </Col>
            <Col md="4">
              <CardCell
                title={
                  <Term
                    title={"Ⓝ Validator Stake"}
                    text={
                      "This NEAR is actively being used to back a validator and secure the network. When you decide to unstake this NEAR, it will take some time to be shown in your Available Balance, as NEAR takes 3 epochs (~36 hours) to unstake. "
                    }
                    href={
                      "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                    }
                  />
                }
                text={<Balance amount={account.stakedBalance} />}
              />
            </Col>
            <Col md="4">
              <CardCell
                title={
                  <Term
                    title={"Ⓝ Balance Profile"}
                    text={
                      'NEAR tokens can be locked in contracts, staked, and delegated, and sometimes we cannot even track them down without your help. Wallet Profile page is the place where we consolidate most of the balances we can aggregate from various sources, so if you want to estimate "total" balance, it is the best place. '
                    }
                    href={
                      "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                    }
                  />
                }
                text={
                  <WalletLink
                    accountId={account.accountId}
                    nearWalletProfilePrefix={
                      currentNearNetwork.nearWalletProfilePrefix
                    }
                  />
                }
              />
            </Col>
          </Row>
        )}
        {account.deletedAtBlockTimestamp === null ||
        typeof account.deletedAtBlockTimestamp === "undefined" ? (
          <Row noGutters className="border-0">
            <Col md="4">
              <CardCell
                title={
                  <Term
                    title={"Created At"}
                    text={
                      "Date and time when this account was created. Some of the accounts are included in the very first block of the network called genesis. "
                    }
                    href={"https://docs.near.org/docs/concepts/account"}
                  />
                }
                text={
                  account.createdByTransactionHash === null ||
                  account.createdByTransactionHash === "Genesis" ? (
                    "Genesis"
                  ) : account.createdAtBlockTimestamp ? (
                    <>
                      {moment(account.createdAtBlockTimestamp).format(
                        "MMMM DD, YYYY [at] h:mm:ssa"
                      )}
                    </>
                  ) : (
                    "N/A"
                  )
                }
                className="account-card-back border-0"
              />
            </Col>
            {account.createdByTransactionHash === null ||
            account.createdByTransactionHash === "Genesis" ? null : (
              <Col md="8">
                <CardCell
                  title={
                    <Term
                      title={"Created By Transaction"}
                      text={
                        "You can inspect the transaction which created this account. "
                      }
                      href={"https://docs.near.org/docs/concepts/account"}
                    />
                  }
                  text={
                    <>
                      {account.createdByTransactionHash}
                      <TransactionLink
                        transactionHash={account.createdByTransactionHash!}
                      >
                        <img
                          className="transaction-link-icon"
                          src={"/static/images/icon-m-copy.svg"}
                        />
                      </TransactionLink>
                    </>
                  }
                  className="account-card-back border-0"
                />
              </Col>
            )}
          </Row>
        ) : (
          <Row noGutters className="border-0">
            <Col md="4">
              <CardCell
                title={
                  <Term
                    title={"Deleted At"}
                    text={"Date and time when this account was deleted. "}
                    href={"https://docs.near.org/docs/concepts/account"}
                  />
                }
                text={
                  <>
                    {moment(account.deletedAtBlockTimestamp).format(
                      "MMMM DD, YYYY [at] h:mm:ssa"
                    )}
                  </>
                }
                className="account-card-back border-0"
              />
            </Col>
            <Col md="8">
              <CardCell
                title={
                  <Term
                    title={"Deleted By Transaction"}
                    text={
                      "You can inspect the transaction which deleted this account. "
                    }
                    href={"https://docs.near.org/docs/concepts/account"}
                  />
                }
                text={
                  <>
                    {account.deletedByTransactionHash}
                    <TransactionLink
                      transactionHash={account.deletedByTransactionHash!}
                    >
                      <img
                        className="transaction-link-icon"
                        src={"/static/images/icon-m-copy.svg"}
                      />
                    </TransactionLink>
                  </>
                }
                className="account-card-back border-0"
              />
            </Col>
          </Row>
        )}
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

          .transaction-link-icon {
            width: 15px;
            margin: 0 0 12px 12px;
          }
        `}</style>
      </div>
    );
  }
}

export default AccountDetails;
