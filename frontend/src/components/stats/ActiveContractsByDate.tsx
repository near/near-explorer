import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

import StatsApi, { ContractsByDate } from "../../libraries/explorer-wamp/stats";

import { Props } from "./TransactionsByDate";

import { Translate } from "react-localize-redux";

const ActiveContractsByDate = ({ chartStyle }: Props) => {
  const [newContractsByDate, setContracts] = useState(Array());
  const [date, setDate] = useState(Array());

  useEffect(() => {
    new StatsApi().activeContractsCountAggregatedByDate().then((contracts) => {
      if (contracts) {
        const newContracts = contracts.map(
          (contract: ContractsByDate) => contract.contractsCount
        );
        setContracts(newContracts);
        const date = contracts.map((contract: ContractsByDate) =>
          contract.date.slice(0, 10)
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
            color: "#04a7bf",
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
                color: "rgb(4, 167, 191)",
              },
              {
                offset: 1,
                color: "rgb(201, 248, 255)",
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
        <ReactEcharts
          option={getOption(
            translate(
              "component.stats.ActiveContractsByDate.daily_number_of_active_contracts"
            ).toString(),
            translate(
              "component.stats.ActiveContractsByDate.active_contracts"
            ).toString(),
            newContractsByDate
          )}
          style={chartStyle}
        />
      )}
    </Translate>
  );
};

export default ActiveContractsByDate;
