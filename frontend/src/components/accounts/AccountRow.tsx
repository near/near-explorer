import moment from "moment";
import React from "react";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import Balance from "../utils/Balance";

export interface Props {
  accountId: string;
  timestamp: any;
}

export interface State {
  amount: string;
}

export default class extends React.Component<Props, State> {
  state: State = {
    amount: ""
  };

  _getDetail = async () => {
    const detail = await new AccountsApi().getAccountInfo(this.props.accountId);
    this.setState({ amount: detail.amount });
  };
  componentWillMount() {
    this._getDetail();
  }
  render() {
    const { accountId, timestamp } = this.props;
    const { amount } = this.state;
    console.log(timestamp);
    let time = moment(timestamp).format("MM/DD/YYYY");
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
            <Col md="7" xs="6">
              <Row>
                <Col className="transaction-row-title">@{accountId}</Col>
              </Row>
            </Col>
            <Col md="3" xs="4" className="ml-auto text-right">
              <Row>
                <Col className="transaction-row-txid">
                  {amount && <Balance amount={amount} />}
                </Col>
              </Row>
              <Row>
                <Col className="transaction-row-timer">Created {time}</Col>
              </Row>
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
                font-family: BentonSans;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #24272a;
              }

              .transaction-row-text {
                font-family: BentonSans;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.5;
                color: #999999;
              }

              .transaction-row-txid {
                font-family: BentonSans;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.29;
                color: #0072ce;
              }

              .transaction-row-timer {
                font-family: BentonSans;
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
