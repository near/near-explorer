import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Account } from "../../libraries/explorer-wamp/stats";

export default () => {
  const [activeAccounts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());
  console.log("ACTIVE ACC", activeAccounts, count);

  useEffect(() => {
    new StatsApi().activeAccountsList().then((accounts: Account[]) => {
      if (accounts) {
        accounts.reverse();
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
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
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
        height: "320px",
        width: "100%",
        marginTop: "26px",
        marginLeft: "24px",
      }}
    />
  );
};
