import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import StatsApi, { Contract } from "../../libraries/explorer-wamp/stats";
import { truncateAccountId } from "../../libraries/formatting";

import { Props } from "./TransactionsByDate";

import { Translate } from "react-localize-redux";

const ActiveContractsList = ({ chartStyle }: Props) => {
  const [activeContracts, setAccounts] = useState(Array());
  const [count, setCount] = useState(Array());

  useEffect(() => {
    new StatsApi().activeContractsList().then((contracts: Contract[]) => {
      if (contracts) {
        contracts.reverse();
        const activeContracts = contracts.map((account: Contract) =>
          truncateAccountId(account.contract)
        );
        const count = contracts.map((account: Contract) =>
          Number(account.receiptsCount)
        );
        setAccounts(activeContracts);
        setCount(count);
      }
    });
  }, []);

  const getOption = (translate: Function) => {
    return {
      title: {
        text: translate("component.stats.ActiveContractsList.title"),
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
          name: translate("common.receipts.receipts"),
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

  return (
    <Translate>
      {({ translate }) => (
        <ReactEcharts option={getOption(translate)} style={chartStyle} />
      )}
    </Translate>
  );
};

export default ActiveContractsList;
