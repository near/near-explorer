import BN from "bn.js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import { utils } from "near-api-js";

import StatsApi from "../../libraries/explorer-wamp/stats";
import { Props } from "./TransactionsByDate";

const CirculatingSupplyStats = ({ chartStyle }: Props) => {
  const { t } = useTranslation();
  const [circulatingSupplyByDate, setCirculatingSupplyByDate] = useState(
    Array()
  );
  const [date, setDate] = useState(Array());
  const [totalTokensSupply, setTotalTokensSupplyByDate] = useState(Array());

  useEffect(() => {
    new StatsApi()
      .getCirculaitngSupplyStats()
      .then((data) => {
        const parseData = data.map(
          ({ date, circulatingTokensSupply, totalTokensSupply }) => ({
            date,
            circulatingTokensSupply: new BN(circulatingTokensSupply)
              .div(utils.format.NEAR_NOMINATION)
              .toNumber(),
            totalTokensSupply: new BN(totalTokensSupply)
              .div(utils.format.NEAR_NOMINATION)
              .toNumber(),
          })
        );

        const date = parseData.map(({ date }) =>
          date.slice(0, 10)
        ) as Array<string>;
        const circulatingSupplyArray = parseData.map(
          ({ circulatingTokensSupply }) => circulatingTokensSupply
        ) as Array<number>;

        const totalTokensSupplyArray = parseData.map(
          ({ totalTokensSupply }) => totalTokensSupply
        ) as Array<number>;
        setDate(date);
        setCirculatingSupplyByDate(circulatingSupplyArray);

        setTotalTokensSupplyByDate(totalTokensSupplyArray);
      })
      .catch((error) => console.error(error));
  }, []);

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
          data: totalTokensSupply,
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
          data: circulatingSupplyByDate,
        },
      ],
    };
  };

  return (
    <>
      <h4>{t("component.stats.CirculatingSupplyStats.circulating_supply")}</h4>
      <h6>
        {t(
          "component.stats.CirculatingSupplyStats.tooltip.total_tokens_supply_explain"
        )}
      </h6>
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
      <style jsx global>{`
        h4,
        h6 {
          margin-left: 30px;
        }
        h4 {
          font-size: 18px;
          font-weight: 700;
        }
        h6 {
          color: #a2a2a8;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default CirculatingSupplyStats;
