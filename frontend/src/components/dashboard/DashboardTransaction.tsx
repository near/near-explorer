import * as React from "react";

import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import DashboardTransactionsHistoryChart from "@explorer/frontend/components/dashboard/DashboardTransactionsHistoryChart";
import DashboardCard from "@explorer/frontend/components/utils/DashboardCard";
import GasPrice from "@explorer/frontend/components/utils/GasPrice";
import Link from "@explorer/frontend/components/utils/Link";
import LongCardCell from "@explorer/frontend/components/utils/LongCardCell";
import Term from "@explorer/frontend/components/utils/Term";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const TransactionCardNumber = styled(Row, {
  "& > .col-12": {
    borderBottom: "2px solid #f1f1f1",
  },
});

const DashboardTransaction: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const recentTransactionsCountSub = useSubscription([
    "recentTransactionsCount",
  ]);
  const latestGasPriceSub = useSubscription(["latestGasPrice"]);

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
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            loading={recentTransactionsCountSub.status === "loading"}
            text={
              recentTransactionsCountSub.status === "success"
                ? recentTransactionsCountSub.data.toLocaleString()
                : null
            }
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
                href="https://docs.near.org/docs/concepts/gas"
              />
            }
            loading={latestGasPriceSub.status === "loading"}
            text={
              latestGasPriceSub.status === "success" ? (
                <GasPrice gasPrice={latestGasPriceSub.data} />
              ) : undefined
            }
          />
        </Col>
      </TransactionCardNumber>
      <DashboardTransactionsHistoryChart />
    </DashboardCard>
  );
});

export default DashboardTransaction;
