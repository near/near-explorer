import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Account } from "../../libraries/explorer-wamp/stats";

const PartnerTotalTransactionList = () => {
  const [activeAccounts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());

  useEffect(() => {
    new StatsApi()
      .partnerTotalTransactionsCount()
      .then((accounts: Account[]) => {
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

  let height = 30 * activeAccounts.length;
  const getOption = () => {
    return {
      title: {
        text: "Partner Accounts for Inception to date of transactions",
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
        height: height.toString() + "px",
        width: "100%",
        marginTop: "26px",
        marginLeft: "24px",
      }}
    />
  );
};

export default PartnerTotalTransactionList;
