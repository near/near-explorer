import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, {
  NewAccountsByDate,
} from "../../libraries/explorer-wamp/stats";

export default () => {
  const [newAccountsByDate, setAccounts] = useState(Array());
  const [date, setDate] = useState(Array());

  useEffect(() => {
    new StatsApi().newAccountsCountAggregatedByDate().then((accounts) => {
      if (accounts) {
        const newAccounts = accounts.map(
          (account: NewAccountsByDate) => account.accountsCount
        );
        const date = accounts.map((account: NewAccountsByDate) => account.date);
        setAccounts(newAccounts);
        setDate(date);
      }
    });
  }, []);

  const getOption = () => {
    return {
      title: {
        text: "Daily Number of New Accounts Created",
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
      series: [
        {
          name: "Txns",
          type: "line",
          lineStyle: {
            color: "#00C1DE",
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
                color: "rgb(0, 193, 222)",
              },
              {
                offset: 1,
                color: "rgb(197, 247, 255)",
              },
            ]),
          },
          data: newAccountsByDate,
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getOption()}
      style={{
        height: "300px",
        width: "100%",
        marginTop: "26px",
        marginLeft: "24px",
      }}
    />
  );
};
