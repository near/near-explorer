import * as React from "react";
import ReactEcharts from "echarts-for-react";

import { truncateAccountId } from "../../libraries/formatting";

import { Props } from "./TransactionsByDate";

import { useTranslation } from "react-i18next";
import { useSubscription } from "../../hooks/use-subscription";
import { TRPCSubscriptionOutput } from "../../types/common";
import PaginationSpinner from "../utils/PaginationSpinner";

const getOption = (
  title: string,
  xAxisTitle: string,
  data: TRPCSubscriptionOutput<"activeAccountsList">
) => {
  return {
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
  };
};

const ActiveAccountsList: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t, i18n } = useTranslation();
  const activeAccountsListSub = useSubscription(["activeAccountsList"]);

  const option = React.useMemo(() => {
    if (!activeAccountsListSub.data) {
      return;
    }
    return getOption(
      t("component.stats.ActiveAccountsList.title"),
      t("common.transactions.transactions"),
      activeAccountsListSub.data.reverse()
    );
  }, [activeAccountsListSub.data, i18n.language]);

  if (!option) {
    return <PaginationSpinner />;
  }
  return <ReactEcharts option={option} style={chartStyle} />;
});

export default ActiveAccountsList;
