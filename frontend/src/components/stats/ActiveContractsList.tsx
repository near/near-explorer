import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Contract } from "../../libraries/explorer-wamp/stats";

export default () => {
  const [activeContracts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());

  useEffect(() => {
    new StatsApi().activeContractsList().then((contracts: Contract[]) => {
      if (contracts) {
        const activeContracts = contracts.map(
          (account: Contract) => account.contract
        );
        const count = contracts.map((account: Contract) =>
          Number(account.receiptsCount)
        );
        setAccounts(activeContracts);
        setCount(count);
      }
    });
  }, []);

  const getOption = () => {
    return {
      title: {
        text: "Top 10 of Active Contracts",
      },
      grid: { containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: [
        {
          name: "Receipts",
          type: "value",
        },
      ],
      yAxis: [
        {
          type: "category",
          data: activeContracts,
        },
      ],
      visualMap: {
        orient: "horizontal",
        left: "center",
        min: 500,
        max: 22000,
        text: ["High Amount", "Low Amount"],
        dimension: 0,
        inRange: {
          color: ["#D7DA8B", "#E15457"],
        },
      },
      series: [
        {
          type: "bar",
          data: count,
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getOption()}
      style={{
        height: "300px",
        width: "100%",
        marginTop: "26px",
        marginLeft: "24px",
      }}
    />
  );
};
