import BN from "bn.js";
import { FC, useCallback, useState } from "react";

import { useTranslation } from "react-i18next";

import ValidatorMainRow from "./ValidatorMainRow";
import ValidatorCollapsedRow from "./ValidatorCollapsedRow";

import * as N from "../../libraries/explorer-wamp/nodes";

interface Props {
  node: N.ValidationNodeInfo;
  index: number;
  totalStake?: BN;
}

const networkHolder: Set<number> = new Set();

const ValidatorRow: FC<Props> = ({ node, index, totalStake }) => {
  const { t } = useTranslation();
  const [isRowActive, setRowActive] = useState(false);
  const switchRowActive = useCallback(() => setRowActive((x) => !x), [
    setRowActive,
  ]);
  let totalStakeInPersnt = 0;
  let cumulativeStake = 0;
  let validatorFee =
    typeof node.fee === "undefined"
      ? undefined
      : node.fee === null
      ? null
      : `${((node.fee.numerator / node.fee.denominator) * 100).toFixed(0)}%`;
  let validatorDelegators =
    typeof node.delegatorsCount === "undefined"
      ? undefined
      : node.delegatorsCount === null
      ? null
      : node.delegatorsCount;

  if (node.currentStake && totalStake) {
    totalStakeInPersnt =
      new BN(node.currentStake).mul(new BN(10000)).div(totalStake).toNumber() /
      100;
  }

  if (node.currentStake && totalStake && node.cumulativeStakeAmount) {
    cumulativeStake =
      node.cumulativeStakeAmount.mul(new BN(10000)).div(totalStake).toNumber() /
      100;
  }

  if (
    networkHolder.size === 0 &&
    totalStake &&
    node.cumulativeStakeAmount &&
    node.cumulativeStakeAmount.gt(totalStake.divn(3))
  ) {
    networkHolder.add(index);
  }

  return (
    <>
      <ValidatorMainRow
        isRowActive={isRowActive}
        accountId={node.account_id}
        index={index}
        countryCode={node.poolDetails?.country_code}
        country={node.poolDetails?.country}
        stakingStatus={node.stakingStatus}
        publicKey={node.public_key}
        validatorFee={validatorFee}
        validatorDelegators={validatorDelegators}
        currentStake={node.currentStake}
        proposedStakeForNextEpoch={node.proposedStake}
        cumulativeStake={cumulativeStake}
        totalStakeInPersnt={totalStakeInPersnt}
        handleClick={switchRowActive}
      />

      <ValidatorCollapsedRow
        isRowActive={isRowActive}
        producedBlocks={node.num_produced_blocks}
        expectedBlocks={node.num_expected_blocks}
        latestProducedValidatorBlock={node.nodeInfo?.lastHeight}
        lastSeen={node.nodeInfo?.lastSeen}
        agentName={node.nodeInfo?.agentName}
        agentVersion={node.nodeInfo?.agentVersion}
        agentBuild={node.nodeInfo?.agentBuild}
        poolWebsite={node.poolDetails?.url}
        poolEmail={node.poolDetails?.email}
        poolTwitter={node.poolDetails?.twitter}
        poolDiscord={node.poolDetails?.discord}
        poolDescription={node.poolDetails?.description}
      />

      {node.cumulativeStakeAmount && networkHolder.has(index) && (
        <tr className="cumulative-stake-holders-row">
          <td colSpan={8} className="warning-text text-center">
            {t("component.nodes.ValidatorRow.warning_tip", {
              node_tip_max: index,
            })}
          </td>
        </tr>
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap");

        .collapse-row-arrow {
          cursor: pointer;
        }

        .collapse-row-arrow.disable {
          cursor: default;
          opacity: 0.3;
          pointer-events: none;
          touch-action: none;
        }

        .validator-nodes-text {
          font-weight: 500;
          font-size: 14px;
          color: #3f4045;
        }

        .validator-node-pub-key {
          color: #2b9af4;
        }

        .validator-name {
          max-width: 250px;
        }

        .validator-name .validator-nodes-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .validator-nodes-details-title {
          display: flex;
          flex-wrap: nowrap;
          font-size: 12px;
          color: #a2a2a8;
        }

        .validator-nodes-text.uptime {
          color: #72727a;
        }

        .validator-nodes-text.stake-text {
          font-weight: 700;
        }

        .validator-nodes-content-row {
          padding-top: 16px;
          padding-bottom: 16px;
        }

        .validator-nodes-content-row > .validator-nodes-content-cell {
          padding: 0 22px;
          border-right: 1px solid #e5e5e6;
        }

        .validator-nodes-content-row
          > .validator-nodes-content-cell:last-child {
          border-right: none;
        }

        .agent-name-badge {
          background-color: #f0f0f1;
          color: #72727a;
          font-weight: 500;
          font-size: 12px;
          font-family: "Roboto Mono", monospace;
        }

        .validators-node-label {
          margin-right: 24px;
          max-width: 138px;
        }

        .cumulative-stake-chart {
          min-width: 100px;
        }

        .cumulative-stake-holders-row {
          background-color: #fff6ed;
        }
        .cumulative-stake-holders-row .warning-text {
          color: #995200;
          padding: 16px 50px;
          font-size: 12px;
        }

        @media (min-width: 1200px) {
          .validator-name {
            max-width: 370px;
          }
        }
      `}</style>
    </>
  );
};

export default ValidatorRow;
