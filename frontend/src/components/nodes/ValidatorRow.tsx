import BN from "bn.js";
import React from "react";

import { Translate } from "react-localize-redux";

import ValidatorMainRow from "./ValidatorMainRow";
import ValidatorCollapsedRow from "./ValidatorCollapsedRow";

import * as N from "../../libraries/explorer-wamp/nodes";

interface Props {
  node: N.ValidationNodeInfo;
  index: number;
  totalStake?: BN;
}
interface State {
  activeRow: boolean;
}

class ValidatorRow extends React.Component<Props, State> {
  state = {
    activeRow: false,
  };

  handleClick = () =>
    this.setState(({ activeRow }) => ({ activeRow: !activeRow }));

  render() {
    const { node, index, totalStake } = this.props;
    let persntStake = 0;
    let cumulativeStake = 0;
    let validatorFee =
      typeof node.fee === "undefined"
        ? null
        : node.fee === null
        ? "N/A"
        : `${((node.fee.numerator / node.fee.denominator) * 100).toFixed(0)}%`;
    let validatorDelegators =
      typeof node.delegatorsCount === "undefined"
        ? null
        : node.delegatorsCount === null
        ? "N/A"
        : node.delegatorsCount;

    if (node.stake && totalStake) {
      persntStake =
        new BN(node.stake).mul(new BN(10000)).div(totalStake).toNumber() / 100;
    }

    if (node.stake && totalStake && node.cumulativeStakeAmount) {
      cumulativeStake =
        new BN(new BN(node.cumulativeStakeAmount))
          .mul(new BN(10000))
          .div(totalStake)
          .toNumber() / 100;
    }

    return (
      <Translate>
        {({ translate }) => (
          <>
            <ValidatorMainRow
              isRowActive={this.state.activeRow}
              accountId={node.account_id}
              index={index}
              countryCode={node.poolDetails?.country_code}
              country={node.poolDetails?.country}
              validatorStatus={node.validatorStatus}
              publicKey={node.public_key}
              validatorFee={validatorFee}
              validatorDelegators={validatorDelegators}
              stake={node.stake}
              stakeProposed={node.stakeProposed}
              cumulativeStake={cumulativeStake}
              persntStake={persntStake}
              handleClick={this.handleClick}
            />

            <ValidatorCollapsedRow
              isRowActive={this.state.activeRow}
              producedBlocks={node.num_produced_blocks}
              expectedBlocks={node.num_expected_blocks}
              validatorsLatestBlock={node.nodeInfo?.lastHeight}
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

            {node.cumulativeStakeAmount && node.networkHolder && (
              <tr className="cumulative-stake-holders-row">
                <td colSpan={8} className="warning-text text-center">
                  {translate("component.nodes.ValidatorRow.warning_tip", {
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
        )}
      </Translate>
    );
  }
}

export default ValidatorRow;
