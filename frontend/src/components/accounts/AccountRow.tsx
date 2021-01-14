import BN from "bn.js";
import Link from "next/link";

import React from "react";
import { Row, Col } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import { truncateAccountId } from "../../libraries/formatting";

import Balance from "../utils/Balance";

export interface Props {
  accountId: string;
}

export interface State {
  totalBalance?: BN;
}

export default class extends React.Component<Props, State> {
  state: State = {};

  _getDetail = async () => {
    const accountInfo = await new AccountsApi().queryAccount(
      this.props.accountId
    );
    this.setState({ totalBalance: accountInfo.totalBalance });
  };

  componentDidMount() {
    this._getDetail();
  }

  render() {
    const { accountId } = this.props;
    const { totalBalance } = this.state;
    return (
      <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
        <a style={{ textDecoration: "none" }}>
          <Row className="transaction-row mx-0">
            <Col md="auto" xs="1" className="pr-0">
              <img
                src="/static/images/icon-t-acct.svg"
                style={{ width: "15px" }}
              />
            </Col>
            <Col md="7" xs="6" className="transaction-row-title pt-1">
              {truncateAccountId(accountId)}
            </Col>
            <Col
              md="3"
              xs="4"
              className="ml-auto pt-1 text-right transaction-row-txid"
            >
              {typeof totalBalance !== "undefined" ? (
                <Balance amount={totalBalance.toString()} />
              ) : (
                ""
              )}
            </Col>
            <style jsx global>{`
              .transaction-row {
                padding-top: 10px;
                padding-bottom: 10px;
                border-top: solid 2px #f8f8f8;
              }

              .transaction-row:hover {
                background: rgba(0, 0, 0, 0.1);
              }

              .transaction-row-title {
                font-family: "Inter", sans-serif;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #24272a;
              }

              .transaction-row-text {
                font-family: "Inter", sans-serif;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.5;
                color: #999999;
              }

              .transaction-row-txid {
                font-family: "Inter", sans-serif;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #0072ce;
              }

              .transaction-row-timer {
                font-family: "Inter", sans-serif;
                font-size: 12px;
                color: #999999;
                font-weight: 100;
              }

              .transaction-row-timer-status {
                font-weight: 500;
              }
            `}</style>
          </Row>
        </a>
      </Link>
    );
  }
}
