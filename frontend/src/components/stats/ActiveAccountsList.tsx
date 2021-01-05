import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Account } from "../../libraries/explorer-wamp/stats";

export default () => {
  const [activeAccounts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());

  useEffect(() => {
    new StatsApi().activeAccountsList().then((accounts: Account[]) => {
      if (accounts) {
        const activeAccounts = accounts.map(
          (account: Account) => account.account
        );
        const count = accounts.map((account: Account) =>
          Number(account.transactionsCount)
        );
        setAccounts(activeAccounts);
        setCount(count);
      }
    });
  }, []);

  const getOption = () => {
    return {
      title: {
        text: "Top 10 of Active Accounts",
      },
      grid: { containLabel: true },
      xAxis: [
        {
          name: "Transactions",
          type: "value",
        },
      ],
      yAxis: [
        {
          type: "category",
          data: activeAccounts,
        },
      ],
      visualMap: {
        orient: "horizontal",
        left: "center",
        min: 500,
        max: 60000,
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
