import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import GasPrice from "../utils/GasPrice";
import TransactionCharts from "../utils/TransactionCharts";

export default () => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <DashboardCard
          className="transaction-card"
          iconPath="/static/images/icon-transactions.svg"
          title="Transactions"
          headerRight={
            <Link href="/transactions">
              <a className="transaction-view-all">View All</a>
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
                    <a href={"https://docs.near.org/docs/concepts/gas"}>docs</a>
                  </Term>
                }
                text={<GasPrice gasPrice={context.latestGasPrice} />}
                loading={!context.latestGasPrice}
              />
            </Col>
          </Row>
          <Row className="transaction-charts">
            <Col md="12">
              <TransactionCharts />
            </Col>
          </Row>
          <style jsx global>{`
            .chart-title {
              font-weight: bold;
              font-size: 16px;
              line-height: 19px;
              color: #00272c;
              padding: 10px 24px;
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
