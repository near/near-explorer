import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import GasPrice from "../utils/GasPrice";
import Link from "../utils/Link";

import DashboardTransactionsHistoryChart from "./DashboardTransactionsHistoryChart";

const DashboardTransaction = () => {
  const { t } = useTranslation();
  return (
    <DatabaseConsumer>
      {(context) => (
        <DashboardCard
          className="transaction-card"
          iconPath="/static/images/icon-transactions.svg"
          title={t("common.transactions.transactions")}
          headerRight={
            <Link href="/transactions">
              <a>{t("button.view_all")}</a>
            </Link>
          }
        >
          <Row className="transaction-card-number">
            <Col xs="12" md="4">
              <LongCardCell
                title={
                  <Term
                    title={t(
                      "component.dashboard.DashboardTransaction.24h_total.title"
                    )}
                    text={t(
                      "component.dashboard.DashboardTransaction.24h_total.text"
                    )}
                    href={"https://docs.near.org/docs/concepts/transaction"}
                  />
                }
                loading={typeof context.recentTransactionsCount === "undefined"}
                text={context.recentTransactionsCount?.toLocaleString()}
              />
            </Col>
            <Col xs="12" md="8">
              <LongCardCell
                title={
                  <Term
                    title={t(
                      "component.dashboard.DashboardTransaction.gas_price.title"
                    )}
                    text={t(
                      "component.dashboard.DashboardTransaction.gas_price.text"
                    )}
                    href={"https://docs.near.org/docs/concepts/gas"}
                  />
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
          {typeof context.transactionsCountHistoryForTwoWeeks !==
          "undefined" ? (
            <Row className="transaction-charts">
              <Col md="12">
                <DashboardTransactionsHistoryChart
                  transactionsCountHistory={
                    context.transactionsCountHistoryForTwoWeeks
                  }
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

export default DashboardTransaction;
