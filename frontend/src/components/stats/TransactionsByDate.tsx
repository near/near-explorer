import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, {
  TransactionsByDate,
} from "../../libraries/explorer-wamp/stats";

export default () => {
  const [transactionsByDate, setTransactions] = useState(Array());
  const [date, setDate] = useState(Array());
  const [total, setTotal] = useState(Array());

  useEffect(() => {
    new StatsApi().transactionsCountAggregatedByDate().then((transactions) => {
      if (transactions) {
        const transactionByDate = transactions.map(
          (transaction: TransactionsByDate) =>
            Number(transaction.transactionsCount)
        );
        const totalTransactionByDate = aggregateTotal(transactionByDate);
        setTransactions(transactionByDate);
        setTotal(totalTransactionByDate);
        const date = transactions.map((transaction: TransactionsByDate) =>
          transaction.date.slice(0, 10)
        );
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
          data: data,
        },
      ],
    };
  };

  return (
    <Tabs defaultActiveKey="daily" id="transactionByDate">
      <Tab eventKey="daily" title="Daily">
        <ReactEcharts
          option={getOption("Daily Amount of Transactions", transactionsByDate)}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title="Total">
        <ReactEcharts
          option={getOption("Total Amount of Transactions", total)}
          style={chartStyle}
        />
      </Tab>
    </Tabs>
  );
};

export const aggregateTotal = (array: Array<number>) =>
  array.reduce((r, a) => {
    if (r.length > 0) a += r[r.length - 1];
    r.push(a);
    return r;
  }, []);

export const chartStyle = {
  height: "480px",
  width: "100%",
  marginTop: "26px",
  marginLeft: "24px",
};
