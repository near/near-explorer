import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Account } from "../../libraries/explorer-wamp/stats";
import { truncateAccountId } from "../../libraries/formatting";

import { Props } from "./TransactionsByDate";

import { useTranslation } from "react-i18next";

const ActiveAccountsList = ({ chartStyle }: Props) => {
  const { t } = useTranslation();
  const [activeAccounts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());

  useEffect(() => {
    new StatsApi().activeAccountsList().then((accounts: Account[]) => {
      if (accounts) {
        accounts.reverse();
        const activeAccounts = accounts.map((account: Account) =>
          truncateAccountId(account.account)
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
        text: t("component.stats.ActiveAccountsList.title"),
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
          name: t("common.transactions.transactions"),
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

  return <ReactEcharts option={getOption()} style={chartStyle} />;
};

export default ActiveAccountsList;
