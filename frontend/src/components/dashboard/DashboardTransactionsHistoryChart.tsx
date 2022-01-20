import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import moment from "moment";

import { TransactionsCountStat } from "../../context/DatabaseProvider";
import PaginationSpinner from "../utils/PaginationSpinner";

import { useTranslation } from "react-i18next";

export interface Props {
  transactionsCountHistory: TransactionsCountStat[];
}

const DashboardTransactionHistoryChart = ({
  transactionsCountHistory,
}: Props) => {
  const { t } = useTranslation();
  const getDate = () => {
    const format = t(
      "component.dashboard.DashboardTransactionHistoryChart.date_format"
    );
    const date = transactionsCountHistory.map((t) =>
      moment(t.date).format(format)
    );
    return date;
  };

  const count = transactionsCountHistory.map((t) => t.total);
  const getOption = () => {
    return {
      title: {
        text: t(
          "component.dashboard.DashboardTransactionHistoryChart.14_day_history.title"
        ),
      },
      tooltip: {
        trigger: "axis",
        position: "top",
        backgroundColor: "#25272A",
        formatter: `{b0}<br />${t(
          "component.dashboard.DashboardTransactionHistoryChart.14_day_history.transactions"
        )}: {c0}`,
      },
      grid: {
        left: "5%",
        bottom: "3%",
        containLabel: true,
        backgroundColor: "#F9F9F9",
        show: true,
        color: "white",
        borderWidth: 0,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: getDate(),
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#9B9B9B",
          },
          offset: 3,
          axisTick: {
            show: false,
          },
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
          splitNumber: 3,
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#9B9B9B",
          },
          offset: 3,
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: "Txns",
          type: "line",
          smooth: true,
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
                color: "rgba(0, 193, 222, 0.19)",
              },
              {
                offset: 1,
                color: "rgba(197, 247, 255, 0)",
              },
            ]),
          },
          data: count,
        },
      ],
    };
  };

  if (transactionsCountHistory.length === 0) {
    return <PaginationSpinner hidden={false} />;
  }
  return (
    <ReactEcharts
      option={getOption()}
      style={{
        height: "232px",
        marginTop: "26px",
        marginBottom: "26px",
      }}
    />
  );
};

export default DashboardTransactionHistoryChart;
