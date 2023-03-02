import * as React from "react";

import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import { TRPCSubscriptionOutput } from "@explorer/common/types/trpc";
import PaginationSpinner from "@explorer/frontend/components/utils/PaginationSpinner";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const getOption = (
  title: string,
  transactionsTitle: string,
  data: TRPCSubscriptionOutput<"transactionsHistory">
) => ({
  title: {
    text: title,
  },
  tooltip: {
    trigger: "axis",
    position: "top",
    backgroundColor: "#25272A",
    formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
      const param = Array.isArray(params) ? params[0] : params;
      const [timestamp, transactionsAmount] = param.data as string[];
      return `${echarts.time.format(timestamp, "{MMM} {dd}", true)}<br />${
        param.seriesName
      }: ${transactionsAmount}`;
    },
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
      type: "time",
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: "#9B9B9B",
        formatter: "{MMM} {dd}",
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
      name: transactionsTitle,
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
      data,
    },
  ],
});

const chartsStyle = {
  height: 232,
  marginVertical: 26,
};

const TransactionCharts = styled(Row, {
  "@media (max-width: 768px)": {
    marginBottom: 178,
  },
});

const DashboardTransactionsHistoryChart: React.FC = React.memo(() => {
  const transactionHistorySub = useSubscription([
    "transactionsHistory",
    { amountOfDays: 14 },
  ]);
  const { t } = useTranslation();

  const option = React.useMemo(() => {
    if (!transactionHistorySub.data) {
      return;
    }
    return getOption(
      t(
        "component.dashboard.DashboardTransactionHistoryChart.14_day_history.title"
      ),
      t(
        "component.dashboard.DashboardTransactionHistoryChart.14_day_history.transactions"
      ),
      transactionHistorySub.data
    );
  }, [transactionHistorySub.data, t]);
  return (
    <TransactionCharts>
      <Col md="12">
        {option ? (
          <ReactEcharts option={option} style={chartsStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Col>
    </TransactionCharts>
  );
});

export default DashboardTransactionsHistoryChart;
