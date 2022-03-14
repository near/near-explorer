import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";

import { cumulativeSumArray } from "../../libraries/stats";

import { Props } from "./TransactionsByDate";

import { useTranslation } from "react-i18next";
import { useWampSimpleQuery } from "../../hooks/wamp";

const NewAccountsByDate = ({ chartStyle }: Props) => {
  const { t } = useTranslation();
  const liveAccounts =
    useWampSimpleQuery("live-accounts-count-aggregated-by-date", []) ?? [];
  const newAccounts =
    useWampSimpleQuery("new-accounts-count-aggregated-by-date", []) ?? [];

  const newAccountsCount = React.useMemo(
    () => newAccounts.map(({ accountsCount }) => Number(accountsCount)),
    [newAccounts]
  );
  const newAccountsDate = React.useMemo(
    () => newAccounts.map(({ date }) => date.slice(0, 10)),
    [newAccounts]
  );
  const cumulativeNewAccountsByDate = React.useMemo(
    () => cumulativeSumArray(newAccountsCount),
    [newAccountsCount]
  );
  const liveAccountsCount = React.useMemo(
    () => liveAccounts.map(({ accountsCount }) => Number(accountsCount)),
    [liveAccounts]
  );
  const liveAccountsDate = React.useMemo(
    () => liveAccounts.map(({ date }) => date.slice(0, 10)),
    [liveAccounts]
  );

  const getOption = (
    title: string,
    seriesName: string,
    data: Array<number>,
    date: Array<string>
  ) => {
    return {
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
          type: "category",
          boundaryGap: false,
          data: date,
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
          symbol: "circle",
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
          data: data,
        },
      ],
    };
  };

  return (
    <Tabs defaultActiveKey="daily" id="newAccountsByDate">
      <Tab eventKey="daily" title={t("common.stats.daily")}>
        <ReactEcharts
          option={getOption(
            t("component.stats.NewAccountsByDate.daily_number_of_new_accounts"),
            t("component.stats.NewAccountsByDate.new_accounts"),
            newAccountsCount,
            newAccountsDate
          )}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="live" title={t("common.stats.live")}>
        <ReactEcharts
          option={getOption(
            t(
              "component.stats.NewAccountsByDate.daily_number_of_live_accounts"
            ),
            t("component.stats.NewAccountsByDate.new_accounts"),
            liveAccountsCount,
            liveAccountsDate
          )}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title={t("common.stats.total")}>
        <ReactEcharts
          option={getOption(
            t("component.stats.NewAccountsByDate.total_number_of_new_accounts"),
            t("component.stats.NewAccountsByDate.new_accounts"),
            cumulativeNewAccountsByDate,
            newAccountsDate
          )}
          style={chartStyle}
        />
      </Tab>
    </Tabs>
  );
};

export default NewAccountsByDate;
