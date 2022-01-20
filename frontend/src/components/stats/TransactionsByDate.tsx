import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";

import StatsApi, {
  TransactionsByDate,
} from "../../libraries/explorer-wamp/stats";
import { cumulativeSumArray } from "../../libraries/stats";

import { useTranslation } from "react-i18next";

export interface Props {
  chartStyle: object;
}

const TransactionsByDateChart = ({ chartStyle }: Props) => {
  const { t } = useTranslation();
  const [transactionsByDate, setTransactions] = useState(Array());
  const [date, setDate] = useState(Array());
  const [cumulativeTransactionsByDate, setTotal] = useState(Array());

  useEffect(() => {
    new StatsApi().transactionsCountAggregatedByDate().then((transactions) => {
      if (transactions) {
        const transactionByDate = transactions.map(
          (transaction: TransactionsByDate) =>
            Number(transaction.transactionsCount)
        );
        const totalTransactionByDate = cumulativeSumArray(transactionByDate);
        setTransactions(transactionByDate);
        setTotal(totalTransactionByDate);
        const date = transactions.map((transaction: TransactionsByDate) =>
          transaction.date.slice(0, 10)
        );
        setDate(date);
      }
    });
  }, []);

  const getOption = (
    title: string,
    seriesName: string,
    data: Array<number>
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
      <Tab eventKey="daily" title={t("common.stats.daily")}>
        <ReactEcharts
          option={getOption(
            t(
              "component.stats.TransactionsByDate.daily_number_of_transactions"
            ),
            t("component.stats.TransactionsByDate.transactions"),
            transactionsByDate
          )}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title={t("common.stats.total")}>
        <ReactEcharts
          option={getOption(
            t(
              "component.stats.TransactionsByDate.total_number_of_transactions"
            ),
            t("component.stats.TransactionsByDate.transactions"),
            cumulativeTransactionsByDate
          )}
          style={chartStyle}
        />
      </Tab>
    </Tabs>
  );
};

export default TransactionsByDateChart;
