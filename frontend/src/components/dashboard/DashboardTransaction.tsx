import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import GasPrice from "../utils/GasPrice";

import DashboardTransactionsHistoryChart from "./DashboardTransactionsHistoryChart";

const DashboardTransactions = () => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <DashboardCard
          className="transaction-card"
          iconPath="/static/images/icon-transactions.svg"
          title="Transactions"
          headerRight={
            <Link href="/transactions">
              <a>View All</a>
            </Link>
          }
        >
          <Row className="transaction-card-number">
            <Col xs="12" md="4">
              <LongCardCell
                title={
                  <Term title={"24hr Total"}>
                    {"The number of transactions in the last 24 hours. "}
                    <a href={"https://docs.near.org/docs/concepts/transaction"}>
                      docs
                    </a>
                  </Term>
                }
                loading={typeof context.recentTransactionsCount === "undefined"}
                text={context.recentTransactionsCount?.[0].total.toLocaleString()}
              />
            </Col>
            <Col xs="12" md="8">
              <LongCardCell
                title={
                  <Term title={"Gas Price"}>
                    {
                      "A unit of Tgas (TerraGas) is 1*10^12 units of gas. The costs of gas are very low in terms of NEAR, which is why Tgas is more commonly used."
                    }
                    <a href={"https://docs.near.org/docs/concepts/gas"}>docs</a>
                  </Term>
                }
                loading={typeof context.latestGasPrice === "undefined"}
                text={
                  typeof context.latestGasPrice !== "undefined" ? (
                    <GasPrice gasPrice={context.latestGasPrice} />
                  ) : undefined
                }
              />
            </Col>
          </Row>
          {typeof context.transactionsCountHistory !== "undefined" ? (
            <Row className="transaction-charts">
              <Col md="12">
                <DashboardTransactionsHistoryChart
                  transactionsCountHistory={context.transactionsCountHistory}
                />
              </Col>
            </Row>
          ) : null}
          <style jsx global>{`
            .transaction-card-number > .col-12 {
              border-bottom: 2px solid #f1f1f1;
            }

            .chart-title {
              font-weight: bold;
              font-size: 16px;
              line-height: 19px;
              color: #00272c;
              padding: 10px 24px;
            }

            .count-percent {
              font-size: 14px;
              font-weight: 300;
              color: #00c08b;
              margin-left: 12px;
            }

            .up-arrow {
              width: 16px;
              margin-top: -4px;
            }

            @media (max-width: 768px) {
              .transaction-charts {
                margin-bottom: 178px;
              }
            }

            @media (max-width: 540px) {
              .react_for_echarts {
                margin-left: 24px;
                margin-top: 26px;
              }
            }
          `}</style>
        </DashboardCard>
      )}
    </DatabaseConsumer>
  );
};

export default DashboardTransactions;
