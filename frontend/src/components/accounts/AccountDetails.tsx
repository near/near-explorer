import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import * as A from "../../libraries/explorer-wamp/accounts";
import { NearNetwork } from "../../libraries/config";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";
import WalletLink from "../utils/WalletLink";

export interface Props {
  account: A.Account;
  currentNearNetwork: NearNetwork;
}

export default class extends React.Component<Props> {
  render() {
    const { account, currentNearNetwork } = this.props;
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col md="4">
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
          <Col md="4">
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
          {account.lockupTotalBalance && (
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
              />
            </Col>
          )}
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title="Wallet Balances"
              text={
                <WalletLink
                  accountId={account.accountId}
                  nearWalletProfilePrefix={
                    currentNearNetwork.nearWalletProfilePrefix
                  }
                />
              }
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
          <Col md="8">
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
