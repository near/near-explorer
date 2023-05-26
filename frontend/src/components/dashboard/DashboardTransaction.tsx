import * as React from "react";

import { useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import { DashboardTransactionsHistoryChart } from "@/frontend/components/dashboard/DashboardTransactionsHistoryChart";
import { DashboardCard } from "@/frontend/components/utils/DashboardCard";
import { GasPrice } from "@/frontend/components/utils/GasPrice";
import { Link } from "@/frontend/components/utils/Link";
import { LongCardCell } from "@/frontend/components/utils/LongCardCell";
import { Term } from "@/frontend/components/utils/Term";
import { useFormatNumber } from "@/frontend/hooks/use-format-number";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import { styled } from "@/frontend/libraries/styles";

const TransactionCardNumber = styled(Row, {
  "& > .col-12": {
    borderBottom: "2px solid #f1f1f1",
  },
});

export const DashboardTransaction: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const recentTransactionsCountSub =
    subscriptions.recentTransactionsCount.useSubscription();
  const latestGasPriceSub = subscriptions.latestGasPrice.useSubscription();
  const formatNumber = useFormatNumber();

  return (
    <DashboardCard
      dataTestId="dashboard-transactions"
      iconPath="/static/images/icon-transactions.svg"
      title={t("common.transactions.transactions")}
      headerRight={
        <Link href="/transactions" css={{ color: "#007bff" }}>
          {t("button.view_all")}
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
            subscription={recentTransactionsCountSub}
          >
            {(recentTransactionsCount) => (
              <>{formatNumber(recentTransactionsCount)}</>
            )}
          </LongCardCell>
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
            subscription={latestGasPriceSub}
          >
            {(latestGasPrice) => <GasPrice gasPrice={latestGasPrice} />}
          </LongCardCell>
        </Col>
      </TransactionCardNumber>
      <DashboardTransactionsHistoryChart />
    </DashboardCard>
  );
});
