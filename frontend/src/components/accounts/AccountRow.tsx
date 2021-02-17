import Link from "next/link";
import moment from "moment";

import React from "react";
import { Row, Col } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";

export interface Props {
  accountId: string;
}

export interface State {
  totalBalance?: string;
  deletedAtBlockTimestamp: number | null;
  createdAtBlockTimestamp: number | null;
}

export default class extends React.Component<Props, State> {
  state: State = {
    deletedAtBlockTimestamp: null,
    createdAtBlockTimestamp: null,
  };

  _getDetail = async () => {
    const accountInfo = await new AccountsApi().getAccountInfo(
      this.props.accountId
    );
    if (!accountInfo) {
      console.warn(
        "Account information retrieval failed for ",
        this.props.accountId
      );
      return;
    }
    this.setState({
      totalBalance: accountInfo.nonStakedBalance,
      deletedAtBlockTimestamp: accountInfo.deletedAtBlockTimestamp,
      createdAtBlockTimestamp: accountInfo.createdAtBlockTimestamp,
    });
  };

  componentDidMount() {
    this._getDetail();
  }

  render() {
    const { accountId } = this.props;
    const {
      totalBalance,
      deletedAtBlockTimestamp,
      createdAtBlockTimestamp,
    } = this.state;
    return (
      <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
        <a style={{ textDecoration: "none" }}>
          <Row className="transaction-row mx-0">
            <Col md="auto" xs="1" className="pr-0">
              <img
                src={
                  deletedAtBlockTimestamp
                    ? "/static/images/icon-t-acct-delete.svg"
                    : "/static/images/icon-t-acct.svg"
                }
                style={{ width: "15px" }}
              />
            </Col>
            <Col md="7" xs="11" className="transaction-row-title pt-1">
              {accountId}
            </Col>
            <Col
              md="3"
              xs="5"
              className="ml-auto pt-1 text-right transaction-row-txid"
            >
              {typeof totalBalance !== "undefined" ? (
                <>
                  <Balance amount={totalBalance} />
                  <div className="transaction-row-timer">
                    Created At {moment(createdAtBlockTimestamp).format("LL")}
                  </div>
                </>
              ) : (
                ""
              )}
              {deletedAtBlockTimestamp ? (
                <div style={{ color: "#FF585D", fontSize: "12px" }}>
                  {" "}
                  Deleted At {moment(deletedAtBlockTimestamp).format("LL")}
                </div>
              ) : null}
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
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #24272a;
                word-break: break-word;
              }

              .transaction-row-text {
                font-size: 12px;
                font-weight: 500;
                line-height: 1.5;
                color: #999999;
              }

              .transaction-row-txid {
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #0072ce;
              }

              .transaction-row-timer {
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
