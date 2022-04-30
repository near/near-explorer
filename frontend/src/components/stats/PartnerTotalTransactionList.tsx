import * as React from "react";
import ReactEcharts from "echarts-for-react";

import { useFetch } from "../../hooks/use-fetch";

const PartnerTotalTransactionList: React.FC = React.memo(() => {
  const partnerTotalTransactions =
    useFetch("partner-total-transactions-count", []) ?? [];
  const partnerTotalTransactionsAccounts = React.useMemo(
    () => partnerTotalTransactions.map(({ account }) => account),
    [partnerTotalTransactions]
  );
  const partnerTotalTransactionsTransactionCount = React.useMemo(
    () =>
      partnerTotalTransactions.map(({ transactionsCount }) =>
        Number(transactionsCount)
      ),
    [partnerTotalTransactions]
  );

  let height = 30 * partnerTotalTransactions.length;
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
          data: partnerTotalTransactionsAccounts,
        },
      ],
      series: [
        {
          type: "bar",
          data: partnerTotalTransactionsTransactionCount,
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
});

export default PartnerTotalTransactionList;
