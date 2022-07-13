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
  data: TRPCSubscriptionOutput<"activeContractsList">
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
        data: data.map(([, receiptsCount]) => receiptsCount),
      },
    ],
  };
};

const ActiveContractsList: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t, i18n } = useTranslation();
  const activeContractsListSub = useSubscription(["activeContractsList"]);

  const option = React.useMemo(() => {
    if (activeContractsListSub.status !== "success") {
      return;
    }
    console.log("data", activeContractsListSub.data);
    return getOption(
      t("component.stats.ActiveContractsList.title"),
      t("common.receipts.receipts"),
      activeContractsListSub.data.reverse()
    );
  }, [activeContractsListSub.data, i18n.language]);

  if (!option) {
    return <PaginationSpinner />;
  }
  return <ReactEcharts option={option} style={chartStyle} />;
});

export default ActiveContractsList;
