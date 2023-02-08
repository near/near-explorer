import * as React from "react";

import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

import { TRPCSubscriptionOutput } from "@explorer/common/types/trpc";
import { Props } from "@explorer/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@explorer/frontend/components/utils/PaginationSpinner";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";

const getOption = (
  title: string,
  seriesName: string,
  data: TRPCSubscriptionOutput<"activeContractsHistory">
) => ({
  title: {
    text: title,
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
    backgroundColor: "#F9F9F9",
    show: true,
    color: "white",
  },
  xAxis: [
    {
      type: "time",
      boundaryGap: false,
    },
  ],
  yAxis: [
    {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "white",
        },
      },
    },
  ],
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
      filterMode: "filter",
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: seriesName,
      type: "line",
      lineStyle: {
        color: "#04a7bf",
        width: 2,
      },
      symbol: "none",
      itemStyle: {
        color: "#25272A",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(4, 167, 191)",
          },
          {
            offset: 1,
            color: "rgb(201, 248, 255)",
          },
        ]),
      },
      data,
    },
  ],
});

const ActiveContractsByDate: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t, i18n } = useTranslation();
  const activeContractsHistorySub = useSubscription(["activeContractsHistory"]);

  const option = React.useMemo(() => {
    if (!activeContractsHistorySub.data) {
      return;
    }
    return getOption(
      t(
        "component.stats.ActiveContractsByDate.daily_number_of_active_contracts"
      ),
      t("component.stats.ActiveContractsByDate.active_contracts"),
      activeContractsHistorySub.data
    );
  }, [activeContractsHistorySub.data, i18n.language]);

  if (!option) {
    return <PaginationSpinner />;
  }
  return <ReactEcharts option={option} style={chartStyle} />;
});

export default ActiveContractsByDate;
