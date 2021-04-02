import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, { AccountsByDate } from "../../libraries/explorer-wamp/stats";
import { cumulativeSumArray } from "../../libraries/stats";

import { Props } from "./TransactionsByDate";

const NewAccountsByDate = ({ chartStyle }: Props) => {
  const [newAccountsByDate, setAccounts] = useState(Array());
  const [date, setDate] = useState(Array());
  const [cumulativeNewAccountsByDate, setTotal] = useState(Array());
  const [liveAccountsByDate, setLive] = useState(Array());
  const [liveDate, setLiveDate] = useState(Array());

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
        setTotal(cumulativeSumArray(newAccounts));
        setDate(date);
      }
    });
    new StatsApi().liveAccountsCountAggregatedByDate().then((accounts) => {
      if (accounts) {
        const liveAccounts = accounts.map((account: AccountsByDate) =>
          Number(account.accountsCount)
        );
        const date = accounts.map((account: AccountsByDate) =>
          account.date.slice(0, 10)
        );
        setLive(liveAccounts);
        setLiveDate(date);
      }
    });
  }, []);

  const getOption = (
    title: string,
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
          option={getOption(
            "Daily Amount of New Accounts",
            newAccountsByDate,
            date
          )}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="live" title="Live">
        <ReactEcharts
          option={getOption(
            "Daily Amount of Live Accounts",
            liveAccountsByDate,
            liveDate
          )}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title="Total">
        <ReactEcharts
          option={getOption(
            "Total Amount of New Accounts",
            cumulativeNewAccountsByDate,
            date
          )}
          style={chartStyle}
        />
      </Tab>
    </Tabs>
  );
};

export default NewAccountsByDate;
