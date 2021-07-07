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

import { Translate } from "react-localize-redux";

export interface Props {
  account: A.Account;
  currentNearNetwork: NearNetwork;
}

class AccountDetails extends React.Component<Props> {
  render() {
    const { account, currentNearNetwork } = this.props;
    return (
      <Translate>
        {({ translate }) => (
          <div className="account-info-container">
            <Row noGutters>
              <Col
                xs="12"
                md={typeof account.storageUsage === "undefined" ? "12" : "4"}
              >
                <CardCell
                  title={
                    <Term
                      title={translate("model.transactions.title").toString()}
                      text={translate("component.accounts.AccountDetails.transactions.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.storage_usage.title").toString()}
                        text={translate("component.accounts.AccountDetails.storage_usage.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.lockup_account.title").toString()}
                        text={translate("component.accounts.AccountDetails.lockup_account.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.native_account_balance.title").toString()}
                        text={translate("component.accounts.AccountDetails.native_account_balance.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.validator_stake.title").toString()}
                        text={translate("component.accounts.AccountDetails.validator_stake.text", undefined, { renderInnerHtml: true })}
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
                        title={translate("component.accounts.AccountDetails.balance_profile.title").toString()}
                        text={translate("component.accounts.AccountDetails.balance_profile.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.created_at.title").toString()}
                        text={translate("component.accounts.AccountDetails.created_at.text").toString()}
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
                          title={translate("component.accounts.AccountDetails.created_by_transaction.title").toString()}
                          text={translate("component.accounts.AccountDetails.created_by_transaction.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.deleted_at.title").toString()}
                        text={translate("component.accounts.AccountDetails.deleted_at.text").toString()}
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
                        title={translate("component.accounts.AccountDetails.deleted_at.title").toString()}
                        text={translate("component.accounts.AccountDetails.deleted_at.title").toString()}
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
        )}
      </Translate>
    );
  }
}

export default AccountDetails;
