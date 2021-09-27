import BN from "bn.js";
import React, { useEffect, useState } from "react";
import { Translate } from "react-localize-redux";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi from "../../libraries/explorer-wamp/stats";
import { Props } from "./TransactionsByDate";

const CirculatingSupplyStats = ({ chartStyle }: Props) => {
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
              .divn(10 ** 6)
              .divn(10 ** 6)
              .toNumber(),
            totalTokensSupply: new BN(totalTokensSupply)
              .divn(10 ** 6)
              .divn(10 ** 6)
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

  const getOption = (
    title: string,
    seriesName: string,
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
          name: seriesName,
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
    <Translate>
      {({ translate }) => (
        <Tabs defaultActiveKey="daily" id="circulatingSupplyByDate">
          <Tab eventKey="daily" title="Daily">
            <ReactEcharts
              option={getOption(
                translate(
                  "component.stats.CirculatingSupplyStats.daily_circulating_supply"
                ).toString(),
                "NEAR",
                circulatingSupplyByDate,
                date
              )}
              style={chartStyle}
            />
          </Tab>
          <Tab eventKey="total" title="Total">
            <ReactEcharts
              option={getOption(
                translate(
                  "component.stats.CirculatingSupplyStats.total_tokens_supply"
                ).toString(),
                "NEAR",
                totalTokensSupply,
                date
              )}
              style={chartStyle}
            />
          </Tab>
        </Tabs>
      )}
    </Translate>
  );
};

export default CirculatingSupplyStats;
