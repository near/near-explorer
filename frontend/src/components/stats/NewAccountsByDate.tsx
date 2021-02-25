import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, { AccountsByDate } from "../../libraries/explorer-wamp/stats";
import { aggregateTotal, Props } from "./TransactionsByDate";

export default ({ chartStyle }: Props) => {
  const [newAccountsByDate, setAccounts] = useState(Array());
  const [date, setDate] = useState(Array());
  const [total, setTotal] = useState(Array());

  useEffect(() => {
    new StatsApi().newAccountsCountAggregatedByDate().then((accounts) => {
      if (accounts) {
        const newAccounts = accounts.map((account: AccountsByDate) =>
          Number(account.accountsCount)
        );
        const date = accounts.map((account: AccountsByDate) =>
          account.date.slice(0, 10)
        );
        setAccounts(newAccounts);
        setTotal(aggregateTotal(newAccounts));
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
          name: "New Accounts",
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
      <Tab eventKey="daily" title="Daily">
        <ReactEcharts
          option={getOption("Daily Amount of New Accounts", newAccountsByDate)}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title="Total">
        <ReactEcharts
          option={getOption("Total Amount of New Accounts", total)}
          style={chartStyle}
        />
      </Tab>
    </Tabs>
  );
};
