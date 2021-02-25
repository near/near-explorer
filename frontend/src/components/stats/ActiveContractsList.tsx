import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Contract } from "../../libraries/explorer-wamp/stats";
import { Props } from "./TransactionsByDate";

export default ({ chartStyle }: Props) => {
  const [activeContracts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());

  useEffect(() => {
    new StatsApi().activeContractsList().then((contracts: Contract[]) => {
      if (contracts) {
        contracts.reverse();
        const activeContracts = contracts.map((account: Contract) =>
          account.contract.length > 25
            ? account.contract.slice(0, 25) + "..."
            : account.contract
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
      series: [
        {
          type: "bar",
          data: count,
        },
      ],
    };
  };

  return <ReactEcharts option={getOption()} style={chartStyle} />;
};
