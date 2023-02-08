import * as React from "react";

import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { Tabs, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { TRPCSubscriptionOutput } from "@explorer/common/types/trpc";
import { Props } from "@explorer/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@explorer/frontend/components/utils/PaginationSpinner";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { getCumulativeArray } from "@explorer/frontend/libraries/stats";

const getOption = (
  title: string,
  seriesName: string,
  data:
    | TRPCSubscriptionOutput<"accountsHistory">["newAccounts"]
    | TRPCSubscriptionOutput<"accountsHistory">["liveAccounts"]
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
        color: "#48d4ab",
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
            color: "rgb(72, 212, 171)",
          },
          {
            offset: 1,
            color: "rgb(201, 255, 239)",
          },
        ]),
      },
      data,
    },
  ],
});

const NewAccountsByDate: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t, i18n } = useTranslation();
  const accountsHistorySub = useSubscription(["accountsHistory"]);

  const options = React.useMemo(() => {
    if (!accountsHistorySub.data) {
      return;
    }
    return {
      daily: getOption(
        t("component.stats.NewAccountsByDate.daily_number_of_new_accounts"),
        t("component.stats.NewAccountsByDate.new_accounts"),
        accountsHistorySub.data.newAccounts
      ),
      cumulative: getOption(
        t("component.stats.NewAccountsByDate.total_number_of_new_accounts"),
        t("component.stats.NewAccountsByDate.new_accounts"),
        getCumulativeArray(
          accountsHistorySub.data.newAccounts,
          ([accountsCount]) => accountsCount
        )
      ),
      live: getOption(
        t("component.stats.NewAccountsByDate.daily_number_of_live_accounts"),
        t("component.stats.NewAccountsByDate.new_accounts"),
        accountsHistorySub.data.liveAccounts
      ),
    };
  }, [accountsHistorySub.data, i18n.language]);

  return (
    <Tabs defaultActiveKey="daily" id="newAccountsByDate">
      <Tab eventKey="daily" title={t("common.stats.daily")}>
        {options ? (
          <ReactEcharts option={options.daily} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
      <Tab eventKey="live" title={t("common.stats.live")}>
        {options ? (
          <ReactEcharts option={options.live} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
      <Tab eventKey="total" title={t("common.stats.total")}>
        {options ? (
          <ReactEcharts option={options.cumulative} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
    </Tabs>
  );
});

export default NewAccountsByDate;
