import Link from "next/link";
import React from "react";
import { Col, Row, Container } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import GasPrice from "../utils/GasPrice";
import TransactionCharts from "../utils/TransactionCharts";

export default () => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <Container style={{ padding: "0" }}>
          <Row className="transaction-card" noGutters>
            <Row className="node-card-header" noGutters>
              <img
                src="/static/images/icon-transactions.svg"
                className="node-icon"
              />
              Transactions
              <Link href="/transactions">
                <a className="transaction-view-all">View All</a>
              </Link>
            </Row>
            <Row className="transaction-card-number" noGutters>
              <Col xs="12" md="4" className="bottom-line">
                <LongCardCell
                  title={
                    <Term title={"24hr Total"}>
                      {"The number of transactions in the last 24 hours. "}
                      <a
                        href={"https://docs.near.org/docs/concepts/transaction"}
                      >
                        docs
                      </a>
                    </Term>
                  }
                  text={context.lastDayTxCount.toLocaleString()}
                  loading={!context.lastDayTxCount}
                />
              </Col>
              <Col xs="12" md="8">
                <LongCardCell
                  title={
                    <Term title={"Gas Price"}>
                      {
                        "A unit of Tgas (TerraGas) is 1*10^12 units of gas. The costs of gas are very low in terms of NEAR, which is why Tgas is more commonly used."
                      }
                      <a href={"https://docs.near.org/docs/concepts/gas"}>
                        docs
                      </a>
                    </Term>
                  }
                  text={<GasPrice gasPrice={context.latestGasPrice} />}
                  loading={false}
                />
              </Col>
            </Row>
            <Row
              className="transaction-charts"
              style={{ width: "100%", height: "210px" }}
            >
              <TransactionCharts />
            </Row>
            <style jsx global>{`
              .transaction-card {
                width: 740px;
                max-width: 100%;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                background: #ffffff;
                margin-bottom: 154px;
              }

              .transaction-view-all {
                margin-left: 472px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                color: #0072ce;
              }

              .transaction-card-number {
                height: 113px;
                border-bottom: 2px solid #f1f1f1;
                width: 100%;
              }

              .chart-title {
                font-weight: bold;
                font-size: 16px;
                line-height: 19px;
                color: #00272c;
                padding: 10px 24px;
                width: 100%;
                height: 40px;
              }

              @media (max-width: 768px) {
                .transaction-view-all {
                  margin-top: -24px;
                  margin-left: 600px;
                }
              }

              @media (max-width: 415px) {
                .transaction-card {
                  width: 100%;
                  border-radius: 0;
                }

                .transaction-view-all {
                  margin-left: 256px;
                }

                .transaction-card-number {
                  height: 174px;
                }

                .bottom-line {
                  border-bottom: 2px solid #f1f1f1;
                }

                .react_for_echarts {
                  margin-left: 24px;
                  margin-top: 26px;
                }
              }
            `}</style>
          </Row>
        </Container>
      )}
    </DatabaseConsumer>
  );
};
