import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

import { TRPCSubscriptionOutput } from "@explorer/common/types/trpc";
import { Props } from "@explorer/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@explorer/frontend/components/utils/PaginationSpinner";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { truncateAccountId } from "@explorer/frontend/libraries/formatting";

const getOption = (
  title: string,
  xAxisTitle: string,
  data: TRPCSubscriptionOutput<"activeContractsList">
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
      data: data.map(([, receiptsCount]) => receiptsCount),
    },
  ],
});

const ActiveContractsList: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t, i18n } = useTranslation();
  const activeContractsListSub = useSubscription(["activeContractsList"]);

  const option = React.useMemo(() => {
    if (activeContractsListSub.status !== "success") {
      return;
    }
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
