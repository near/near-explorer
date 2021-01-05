import React, { useContext } from "react";
import ReactEcharts from "echarts-for-react";

import { NodeContext } from "../../context/NodeProvider";
import { formatNEAR } from "../utils/Balance";
import BN from "bn.js";

export default () => {
  const nodes = useContext(NodeContext);
  const validators = nodes.validators;
  const validatorsName = validators.map((v: any) => v.account_id);
  const validatorsStake = validators.map((v: any) => {
    let stake = formatNEAR(v.stake);
    stake = stake.slice(0, stake.length - 6);
    stake = parseFloat(stake.replace(/,/g, ""));
    return stake;
  });
  let totalStakeBN = validators.reduce(
    (acc: BN, validator: any) => acc.add(new BN(validator.stake)),
    new BN(0)
  );
  let totalStake = formatNEAR(totalStakeBN);
  let height = 20 * validators.length;
  const getOption = () => {
    return {
      title: {
        text: "Stake Volumn for Validating Nodes",
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
    <>
      <hr />
      <h2>
        Total Stake Volume for current epoch is{" "}
        <strong style={{ color: "#0072ce" }}>{totalStake}</strong> Ⓝ
      </h2>
      <ReactEcharts
        option={getOption()}
        style={{
          height: height.toString() + "px",
          width: "100%",
          marginTop: "26px",
          marginLeft: "24px",
        }}
      />
    </>
  );
};
