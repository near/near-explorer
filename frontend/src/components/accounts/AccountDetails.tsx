import moment from "moment";

import { Component } from "react";

import { Row, Col, Spinner } from "react-bootstrap";

import AccountsApi, { Account } from "../../libraries/explorer-wamp/accounts";
import { NearNetwork } from "../../libraries/config";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import TransactionLink from "../utils/TransactionLink";
import WalletLink from "../utils/WalletLink";
import StorageSize from "../utils/StorageSize";

import { Translate } from "react-localize-redux";

export interface Props {
  account: Account;
  currentNearNetwork: NearNetwork;
}

interface State {
  outTransactionsCount?: number;
  inTransactionsCount?: number;
}

class AccountDetails extends Component<Props> {
  state: State = {};

  collectTransactionCount = async () => {
    new AccountsApi()
      .queryAccountStats(this.props.account.accountId)
      .then((accountStats) => {
        if (accountStats) {
          this.setState({
            outTransactionsCount: accountStats.outTransactionsCount,
            inTransactionsCount: accountStats.inTransactionsCount,
          });
        }
        return;
      })
      .catch((error) => {
        console.warn(
          "Account information retrieval failed for ",
          this.props.account.accountId,
          error
        );
      });
  };

  componentDidMount() {
    this.collectTransactionCount();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.account.accountId !== this.props.account.accountId) {
      this.setState(
        {
          outTransactionsCount: undefined,
          inTransactionsCount: undefined,
        },
        this.collectTransactionCount
      );
    }
  }

  componentWillUnmount() {
    this.setState({
      outTransactionsCount: undefined,
      inTransactionsCount: undefined,
    });
  }

  render() {
    const { account, currentNearNetwork } = this.props;
    const { outTransactionsCount, inTransactionsCount } = this.state;

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
                      title={translate(
                        "component.accounts.AccountDetails.transactions.title"
                      )}
                      text={translate(
                        "component.accounts.AccountDetails.transactions.text"
                      )}
                      href={"https://docs.near.org/docs/concepts/transaction"}
                    />
                  }
                  imgLink="/static/images/icon-m-transaction.svg"
                  text={
                    <>
                      <span>
                        &uarr;
                        {outTransactionsCount !== undefined ? (
                          outTransactionsCount.toLocaleString()
                        ) : (
                          <Spinner animation="border" variant="secondary" />
                        )}
                      </span>
                      &nbsp;&nbsp;
                      <span>
                        &darr;
                        {inTransactionsCount !== undefined ? (
                          inTransactionsCount.toLocaleString()
                        ) : (
                          <Spinner animation="border" variant="secondary" />
                        )}
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
                        title={translate(
                          "component.accounts.AccountDetails.storage_usage.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.storage_usage.text"
                        )}
                        href={
                          "https://docs.near.org/docs/concepts/storage-staking"
                        }
                      />
                    }
                    imgLink="/static/images/icon-storage.svg"
                    text={<StorageSize value={Number(account.storageUsage)} />}
                  />
                </Col>
              )}
              {account.lockupAccountId && (
                <Col xs="12" md="4">
                  <CardCell
                    title={
                      <Term
                        title={translate(
                          "component.accounts.AccountDetails.lockup_account.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.lockup_account.text"
                        )}
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
                        title={translate(
                          "component.accounts.AccountDetails.native_account_balance.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.native_account_balance.text"
                        )}
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
                        title={translate(
                          "component.accounts.AccountDetails.validator_stake.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.validator_stake.text",
                          undefined,
                          { renderInnerHtml: true }
                        )}
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
                        title={translate(
                          "component.accounts.AccountDetails.balance_profile.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.balance_profile.text"
                        )}
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
                        title={translate(
                          "component.accounts.AccountDetails.created_at.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.created_at.text"
                        )}
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
                            translate(
                              "common.date_time.date_time_format"
                            ).toString()
                          )}
                        </>
                      ) : (
                        translate("common.state.not_available").toString()
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
                          title={translate(
                            "component.accounts.AccountDetails.created_by_transaction.title"
                          )}
                          text={translate(
                            "component.accounts.AccountDetails.created_by_transaction.text"
                          )}
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
                        title={translate(
                          "component.accounts.AccountDetails.deleted_at.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.deleted_at.text"
                        )}
                        href={"https://docs.near.org/docs/concepts/account"}
                      />
                    }
                    text={
                      <>
                        {moment(account.deletedAtBlockTimestamp).format(
                          translate(
                            "common.date_time.date_time_format"
                          ).toString()
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
                        title={translate(
                          "component.accounts.AccountDetails.deleted_by_transaction.title"
                        )}
                        text={translate(
                          "component.accounts.AccountDetails.deleted_by_transaction.text"
                        )}
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
