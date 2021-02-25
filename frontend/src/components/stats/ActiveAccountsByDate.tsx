import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, { AccountsByDate } from "../../libraries/explorer-wamp/stats";
import { chartStyle } from "./TransactionsByDate";

export default () => {
  const [activeAccountsByDate, setAccounts] = useState(Array());
  const [date, setDate] = useState(Array());

  useEffect(() => {
    new StatsApi().activeAccountsCountAggregatedByDate().then((accounts) => {
      if (accounts) {
        const newAccounts = accounts.map(
          (account: AccountsByDate) => account.accountsCount
        );
        const date = accounts.map((account: AccountsByDate) =>
          account.date.slice(0, 10)
        );
        setAccounts(newAccounts);
        setDate(date);
      }
    });
  }, []);

  const getOption = (title: string, data: Array<number>) => {
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
          name: "Active Accounts",
          type: "line",
          lineStyle: {
            color: "#04a7bf",
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
                color: "rgb(4, 167, 191)",
              },
              {
                offset: 1,
                color: "rgb(201, 248, 255)",
              },
            ]),
          },
          data: data,
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getOption(
        "Daily Amount of Active Accounts",
        activeAccountsByDate
      )}
      style={chartStyle}
    />
  );
};
