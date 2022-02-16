import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import GasPrice from "../utils/GasPrice";
import Link from "../utils/Link";

import DashboardTransactionsHistoryChart from "./DashboardTransactionsHistoryChart";
import { useChainTransactionStats } from "../../hooks/subscriptions";
import { useLatestGasPrice } from "../../hooks/data";
import { styled } from "../../libraries/styles";

const TransactionCardNumber = styled(Row, {
  "& > .col-12": {
    borderBottom: "2px solid #f1f1f1",
  },
});

const TransactionCharts = styled(Row, {
  "@media (max-width: 768px)": {
    marginBottom: 178,
  },
});

const DashboardTransaction = () => {
  const { t } = useTranslation();
  const transactionsCountHistoryForTwoWeeks = useChainTransactionStats()
    ?.transactionsCountHistoryForTwoWeeks;
  const recentTransactionsCount = useChainTransactionStats()
    ?.recentTransactionsCount;
  const latestGasPrice = useLatestGasPrice();

  return (
    <DashboardCard
      dataId="transactions"
      iconPath="/static/images/icon-transactions.svg"
      title={t("common.transactions.transactions")}
      headerRight={
        <Link href="/transactions">
          <a>{t("button.view_all")}</a>
        </Link>
      }
    >
      <TransactionCardNumber>
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
            loading={recentTransactionsCount === undefined}
            text={recentTransactionsCount?.toLocaleString()}
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
            loading={latestGasPrice === undefined}
            text={
              latestGasPrice !== undefined ? (
                <GasPrice gasPrice={latestGasPrice} />
              ) : undefined
            }
          />
        </Col>
      </TransactionCardNumber>
      {transactionsCountHistoryForTwoWeeks ? (
        <TransactionCharts>
          <Col md="12">
            <DashboardTransactionsHistoryChart />
          </Col>
        </TransactionCharts>
      ) : null}
    </DashboardCard>
  );
};

export default DashboardTransaction;
