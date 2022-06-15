import { useTranslation } from "react-i18next";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import * as React from "react";
import JSBI from "jsbi";

import { Props } from "./TransactionsByDate";
import { useSubscription } from "../../hooks/use-subscription";
import { styled } from "../../libraries/styles";
import * as BI from "../../libraries/bigint";

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
  const tokensSupplySub = useSubscription(["tokensSupply"]);
  const circulatingTokenSupply = React.useMemo(
    () =>
      (tokensSupplySub.data ?? []).map(({ circulatingSupply }) =>
        JSBI.toNumber(
          JSBI.divide(JSBI.BigInt(circulatingSupply), BI.nearNomination)
        )
      ),
    [tokensSupplySub.data]
  );
  const totalTokenSupply = React.useMemo(
    () =>
      (tokensSupplySub.data ?? []).map(({ totalSupply }) =>
        JSBI.toNumber(JSBI.divide(JSBI.BigInt(totalSupply), BI.nearNomination))
      ),
    [tokensSupplySub.data]
  );
  const supplyDates = React.useMemo(
    () =>
      (tokensSupplySub.data ?? []).map(({ timestamp }) =>
        new Date(timestamp).toISOString().slice(0, 10)
      ),
    [tokensSupplySub.data]
  );

  const getOption = (seriesNameArray: Array<string>) => {
    return {
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
          type: "category",
          boundaryGap: false,
          data: supplyDates,
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
          name: seriesNameArray[0],
          type: "line",
          lineStyle: {
            color: "#4d84d6",
            width: 2,
          },
          symbol: "circle",
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
          data: totalTokenSupply,
        },
        {
          name: seriesNameArray[1],
          type: "line",
          lineStyle: {
            color: "#04a7bf",
            width: 2,
          },
          symbol: "circle",
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
          data: circulatingTokenSupply,
        },
      ],
    };
  };

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
      <ReactEcharts
        option={getOption([
          `${t(
            "component.stats.CirculatingSupplyStats.tooltip.total_tokens_supply"
          )}`,
          `${t(
            "component.stats.CirculatingSupplyStats.tooltip.circulating_supply"
          )}`,
        ])}
        style={{
          ...chartStyle,
          marginTop: "5px",
        }}
      />
    </>
  );
});

export default CirculatingSupplyStats;
