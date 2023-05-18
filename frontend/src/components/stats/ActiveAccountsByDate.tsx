import * as React from "react";

import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "next-i18next";
import { Tabs, Tab } from "react-bootstrap";

import { TRPCSubscriptionOutput } from "@/common/types/trpc";
import { Props } from "@/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@/frontend/components/utils/PaginationSpinner";
import { useSubscription } from "@/frontend/hooks/use-subscription";

const getOption = (
  title: string,
  seriesName: string,
  data:
    | TRPCSubscriptionOutput<"activeAccountsHistory">["byDay"]
    | TRPCSubscriptionOutput<"activeAccountsHistory">["byWeek"]
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

const ActiveAccountsByDate: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t } = useTranslation();
  const activeAccountsHistorySub = useSubscription(["activeAccountsHistory"]);

  const options = React.useMemo(() => {
    if (!activeAccountsHistorySub.data) {
      return;
    }
    return {
      byDay: getOption(
        t(
          "component.stats.ActiveAccountsByDate.daily_number_of_active_accounts"
        ),
        t("component.stats.ActiveAccountsByDate.active_accounts"),
        activeAccountsHistorySub.data.byDay
      ),
      byWeek: getOption(
        t(
          "component.stats.ActiveAccountsByDate.weekly_number_of_active_accounts"
        ),
        t("component.stats.ActiveAccountsByDate.active_accounts"),
        activeAccountsHistorySub.data.byWeek
      ),
    };
  }, [activeAccountsHistorySub.data, t]);

  return (
    <Tabs defaultActiveKey="daily" id="activeAccountsByDate">
      <Tab eventKey="daily" title={t("common.stats.daily")}>
        {options ? (
          <ReactEcharts option={options.byDay} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
      <Tab eventKey="weekly" title={t("common.stats.weekly")}>
        {options ? (
          <ReactEcharts option={options.byWeek} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
    </Tabs>
  );
});

export default ActiveAccountsByDate;
