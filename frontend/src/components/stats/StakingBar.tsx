import React, { useContext } from "react";
import ReactEcharts from "echarts-for-react";
import { utils } from "near-api-js";
import BN from "bn.js";

import { NodeContext } from "../../context/NodeProvider";

export default () => {
  const nodes = useContext(NodeContext);
  const validators = nodes.validators;
  const validatorsName = validators.map((v: any) => v.account_id);
  const validatorsStake = validators.map((v: any) => {
    let stake = utils.format.formatNearAmount(v.stake, 0).toString();
    return parseFloat(stake.replace(/,/g, ""));
  });
  let totalStakeBN = validators.reduce(
    (acc: BN, validator: any) => acc.add(new BN(validator.stake)),
    new BN(0)
  );
  let totalStake = utils.format.formatNearAmount(totalStakeBN.toString(), 5);
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
