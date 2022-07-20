import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";

import { useTranslation } from "react-i18next";
import { useSubscription } from "../../hooks/use-subscription";
import PaginationSpinner from "../utils/PaginationSpinner";
import { getCumulativeArray } from "../../libraries/stats";

const getOption = (
  title: string,
  seriesName: string,
  data: [number, number][]
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
          color: "#00C1DE",
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
              color: "rgb(0, 193, 222)",
            },
            {
              offset: 1,
              color: "rgb(197, 247, 255)",
            },
          ]),
        },
        data,
      },
    ],
  };
};

export interface Props {
  chartStyle: object;
}

const TransactionsByDateChart: React.FC<Props> = React.memo(
  ({ chartStyle }) => {
    const { t, i18n } = useTranslation();
    const transactionsHistorySub = useSubscription(["transactionsHistory"]);

    const options = React.useMemo(() => {
      if (!transactionsHistorySub.data) {
        return;
      }
      return {
        daily: getOption(
          t("component.stats.TransactionsByDate.daily_number_of_transactions"),
          t("component.stats.TransactionsByDate.transactions"),
          transactionsHistorySub.data
        ),
        cumulative: getOption(
          t("component.stats.TransactionsByDate.total_number_of_transactions"),
          t("component.stats.TransactionsByDate.transactions"),
          getCumulativeArray(transactionsHistorySub.data, ([count]) => count)
        ),
      };
    }, [transactionsHistorySub.data, i18n.language]);

    return (
      <Tabs defaultActiveKey="daily" id="transactionByDate">
        <Tab eventKey="daily" title={t("common.stats.daily")}>
          {options ? (
            <ReactEcharts option={options.daily} style={chartStyle} />
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
  }
);

export default TransactionsByDateChart;
