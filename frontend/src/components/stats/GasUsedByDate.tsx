import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, {
  TeragasUsedByDate,
} from "../../libraries/explorer-wamp/stats";
import { cumulativeSumArray } from "../../libraries/stats";

import { Props } from "./TransactionsByDate";

export default ({ chartStyle }: Props) => {
  const [teragasUsedByDate, setTeragasUsedByDate] = useState(Array());
  const [date, setDate] = useState(Array());
  const [total, setTotal] = useState(Array());

  useEffect(() => {
    new StatsApi().teragasUsedAggregatedByDate().then((teragasUsed) => {
      if (teragasUsed) {
        const gas = teragasUsed.map((gas: TeragasUsedByDate) =>
          Number(gas.teragasUsed)
        );
        setTotal(cumulativeSumArray(gas));
        setTeragasUsedByDate(gas);
        const date = teragasUsed.map((gas: TeragasUsedByDate) =>
          gas.date.slice(0, 10)
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
          name: "Tera Gas",
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
          name: "TeraGas",
          type: "line",
          lineStyle: {
            color: "#4d84d6",
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
                color: "rgb(21, 99, 214)",
              },
              {
                offset: 1,
                color: "rgb(197, 221, 255)",
              },
            ]),
          },
          data: data,
        },
      ],
    };
  };

  return (
    <Tabs defaultActiveKey="daily" id="gasUsedByDate">
      <Tab eventKey="daily" title="Daily">
        <ReactEcharts
          option={getOption("Daily Amount of Used Tera Gas", teragasUsedByDate)}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title="Total">
        <ReactEcharts
          option={getOption("Total Amount of Used Tera Gas", total)}
          style={chartStyle}
        />
      </Tab>
    </Tabs>
  );
};
