import BN from "bn.js";

import React from "react";
import ReactEcharts from "echarts-for-react";

import { utils } from "near-api-js";

import { ValidationNodeInfo } from "../../libraries/explorer-wamp/nodes";

import { Translate } from "react-localize-redux";

export interface Props {
  validators: ValidationNodeInfo[];
}

const StakingBar = ({ validators }: Props) => {
  validators.sort((v1: ValidationNodeInfo, v2: ValidationNodeInfo) => {
    let diff = new BN(v1.currentStake).sub(new BN(v2.currentStake)).toString();
    return Number(diff.slice(0, 5));
  });
  const validatorsName = validators.map(
    (v: ValidationNodeInfo) => v.account_id
  );
  const validatorsStake = validators.map((v: ValidationNodeInfo) => {
    let stake = utils.format.formatNearAmount(v.currentStake, 0).toString();
    return parseFloat(stake.replace(/,/g, ""));
  });
  let totalStakeBN = validators.reduce(
    (acc: BN, validator: ValidationNodeInfo) =>
      acc.add(new BN(validator.currentStake)),
    new BN(0)
  );
  let totalStake = utils.format.formatNearAmount(totalStakeBN.toString(), 5);
  let height = 20 * validators.length;

  const getOption = (translate: Function) => {
    return {
      title: {
        text: translate("component.stats.StakingBar.title"),
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
    <Translate>
      {({ translate }) => (
        <>
          <h2>
            {translate(
              "component.stats.StakingBar.total_stake_volume_for_current_epoch_is"
            ).toString()}{" "}
            <strong style={{ color: "#0072ce" }}>{totalStake}</strong> Ⓝ
          </h2>
          <ReactEcharts
            option={getOption(translate)}
            style={{
              height: height.toString() + "px",
              width: "100%",
              marginTop: "26px",
              marginLeft: "24px",
            }}
          />
        </>
      )}
    </Translate>
  );
};

export default StakingBar;
