import * as React from "react";

import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "next-i18next";

import { TRPCSubscriptionOutput } from "@/common/types/trpc";
import { Props } from "@/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@/frontend/components/utils/PaginationSpinner";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import { styled } from "@/frontend/libraries/styles";

const getOption = (
  totalTokenSupplyHeader: string,
  circulatingTokenSupplyHeader: string,
  data: TRPCSubscriptionOutput<"subscriptions.tokensSupply">
) => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
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
      name: "NEAR",
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
      name: totalTokenSupplyHeader,
      type: "line",
      lineStyle: {
        color: "#4d84d6",
        width: 2,
      },
      symbol: "none",
      itemStyle: {
        color: "#4d84d6",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(21, 99, 214)",
          },
          {
            offset: 0,
            color: "rgb(197, 221, 255)",
          },
        ]),
      },
      emphasis: {
        focus: "series",
        itemStyle: {
          color: "#25272A",
        },
      },
      data: data.map(([timestamp, totalSupply]) => [timestamp, totalSupply]),
    },
    {
      name: circulatingTokenSupplyHeader,
      type: "line",
      lineStyle: {
        color: "#04a7bf",
        width: 2,
      },
      symbol: "none",
      itemStyle: {
        color: "#04a7bf",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(4, 167, 191)",
          },
          {
            offset: 0,
            color: "rgb(201, 248, 255)",
          },
        ]),
      },
      emphasis: {
        focus: "series",
        itemStyle: {
          color: "#25272A",
        },
      },
      data: data.map(([timestamp, , circulatingSupply]) => [
        timestamp,
        circulatingSupply,
      ]),
    },
  ],
});

const SupplyHeader = styled("div", {
  marginLeft: 30,
  marginBottom: "0.5rem",
  fontSize: 18,
  fontWeight: 700,
});

const SupplySubHeader = styled("div", {
  marginLeft: 30,
  marginBottom: "0.5rem",
  color: "#a2a2a8",
  fontSize: 14,
  fontWeight: 500,
});

const CirculatingSupplyStats: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t } = useTranslation();
  const tokensSupplySub = subscriptions.tokensSupply.useSubscription();

  const option = React.useMemo(() => {
    if (!tokensSupplySub.data) {
      return;
    }
    return getOption(
      t("component.stats.CirculatingSupplyStats.tooltip.total_tokens_supply"),
      t("component.stats.CirculatingSupplyStats.tooltip.circulating_supply"),
      tokensSupplySub.data
    );
  }, [tokensSupplySub.data, t]);

  return (
    <>
      <SupplyHeader>
        {t("component.stats.CirculatingSupplyStats.circulating_supply")}
      </SupplyHeader>
      <SupplySubHeader>
        {t(
          "component.stats.CirculatingSupplyStats.tooltip.total_tokens_supply_explain"
        )}
      </SupplySubHeader>
      {option ? (
        <ReactEcharts
          option={option}
          style={{
            ...chartStyle,
            marginTop: "5px",
          }}
        />
      ) : (
        <PaginationSpinner />
      )}
    </>
  );
});

export default CirculatingSupplyStats;
