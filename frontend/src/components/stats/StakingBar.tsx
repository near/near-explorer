import BN from "bn.js";

import React from "react";
import ReactEcharts from "echarts-for-react";

import { utils } from "near-api-js";

import { ValidationNodeInfo } from "../../libraries/explorer-wamp/nodes";

export interface Props {
  validators: ValidationNodeInfo[];
}

const StakingBar = ({ validators }: Props) => {
  validators.sort((v1: any, v2: any) => {
    let diff = new BN(v1.stake).sub(new BN(v2.stake)).toString();
    return Number(diff.slice(0, 5));
  });
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
        text: "Stake Volume for Validating Nodes",
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

export default StakingBar;
