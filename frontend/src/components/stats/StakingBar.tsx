import React, { useContext } from "react";
import ReactEcharts from "echarts-for-react";

import { NodeContext } from "../../context/NodeProvider";
import { formatNEAR } from "../utils/Balance";

export default () => {
  const nodes = useContext(NodeContext);
  const validators = nodes.validators;
  const validatorsName = validators.map((v: any) => v.account_id);
  const validatorsStake = validators.map((v: any) => formatNEAR(v.stake));
  console.log(nodes);
  const getOption = () => {
    return {
      title: {
        text: "Stake Volumn for Validating Nodes",
      },
      grid: { containLabel: true },
      xAxis: [
        {
          name: "Ⓝ",
          type: "value",
        },
      ],
      yAxis: [
        {
          type: "category",
          data: validatorsName,
        },
      ],
      series: [
        {
          type: "bar",
          data: validatorsStake,
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
