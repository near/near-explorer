import React, { useMemo } from "react";
import ReactEcharts from "echarts-for-react";

import { useWampSimpleQuery } from "../../hooks/wamp";

const PartnerFirst3MonthTransactionList = () => {
  const partnerFirst3MonthTransactions =
    useWampSimpleQuery("partner-first-3-month-transactions-count", []) ?? [];
  const partnerFirst3MonthTransactionsAccounts = useMemo(
    () => partnerFirst3MonthTransactions.map(({ account }) => account),
    [partnerFirst3MonthTransactions]
  );
  const partnerFirst3MonthTransactionsTransactionCount = useMemo(
    () =>
      partnerFirst3MonthTransactions.map(({ transactionsCount }) =>
        Number(transactionsCount)
      ),
    [partnerFirst3MonthTransactions]
  );

  let height = 30 * partnerFirst3MonthTransactions.length;

  const getOption = () => {
    return {
      title: {
        text:
          "Partner Accounts of transactions the first 3 months on the network",
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
          data: partnerFirst3MonthTransactionsAccounts,
        },
      ],
      series: [
        {
          type: "bar",
          data: partnerFirst3MonthTransactionsTransactionCount,
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

export default PartnerFirst3MonthTransactionList;
