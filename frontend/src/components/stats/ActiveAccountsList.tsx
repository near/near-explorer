import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { useTranslation } from "next-i18next";

import { TRPCSubscriptionOutput } from "@/common/types/trpc";
import { Props } from "@/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@/frontend/components/utils/PaginationSpinner";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import { truncateAccountId } from "@/frontend/libraries/formatting";

const getOption = (
  title: string,
  xAxisTitle: string,
  data: TRPCSubscriptionOutput<"subscriptions.activeAccountsList">
) => ({
  title: {
    text: title,
  },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  xAxis: [
    {
      name: xAxisTitle,
      type: "value",
    },
  ],
  yAxis: [
    {
      data: data.map(([accountId]) => truncateAccountId(accountId)),
    },
  ],
  series: [
    {
      type: "bar",
      data: data.map(([, transactionsCount]) => transactionsCount),
    },
  ],
});

const ActiveAccountsList: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t } = useTranslation();
  const activeAccountsListSub =
    subscriptions.activeAccountsList.useSubscription();

  const option = React.useMemo(() => {
    if (!activeAccountsListSub.data) {
      return;
    }
    return getOption(
      t("component.stats.ActiveAccountsList.title"),
      t("common.transactions.transactions"),
      activeAccountsListSub.data.reverse()
    );
  }, [activeAccountsListSub.data, t]);

  if (!option) {
    return <PaginationSpinner />;
  }
  return <ReactEcharts option={option} style={chartStyle} />;
});

export default ActiveAccountsList;
