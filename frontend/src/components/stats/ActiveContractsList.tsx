import * as React from "react";
import ReactEcharts from "echarts-for-react";

import { truncateAccountId } from "../../libraries/formatting";

import { Props } from "./TransactionsByDate";

import { useTranslation } from "react-i18next";
import { useWampQuery } from "../../hooks/wamp";

const ActiveContractsList: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t } = useTranslation();
  const activeContracts =
    useWampQuery(
      React.useCallback(
        async (wampCall) =>
          ((await wampCall("active-contracts-list", [])) ?? []).reverse(),
        []
      )
    ) ?? [];
  const activeContractsIds = React.useMemo(
    () => activeContracts.map(({ contract }) => truncateAccountId(contract)),
    [activeContracts]
  );
  const activeContractsReceiptsCount = React.useMemo(
    () => activeContracts.map(({ receiptsCount }) => Number(receiptsCount)),
    [activeContracts]
  );

  const getOption = () => {
    return {
      title: {
        text: t("component.stats.ActiveContractsList.title"),
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
          name: t("common.receipts.receipts"),
          type: "value",
        },
      ],
      yAxis: [
        {
          type: "category",
          data: activeContractsIds,
        },
      ],
      series: [
        {
          type: "bar",
          data: activeContractsReceiptsCount,
        },
      ],
    };
  };

  return <ReactEcharts option={getOption()} style={chartStyle} />;
});

export default ActiveContractsList;
