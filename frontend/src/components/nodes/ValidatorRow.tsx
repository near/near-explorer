import BN from "bn.js";
import { FC, useCallback, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";

import ValidatorMainRow from "./ValidatorMainRow";
import ValidatorCollapsedRow from "./ValidatorCollapsedRow";
import { ValidationNodeInfo } from "../../libraries/wamp/types";

import { styled } from "../../libraries/styles";

export const ValidatorNodesDetailsTitle = styled(Col, {
  display: "flex",
  flexWrap: "nowrap",
  fontSize: 12,
  color: "#a2a2a8",
});

export const ValidatorNodesContentCell = styled(Col, {
  // TODO: find out why stylesheet specificity takes bootstrap sheet over stitches sheet
  padding: "0 22px !important",
  borderRight: "1px solid #e5e5e6",

  "&:last-child": {
    borderRight: "none",
  },
});

export const ValidatorNodesContentRow = styled(Row, {
  paddingTop: 16,
  paddingBottom: 16,
});

const CumulativeStakeholdersRow = styled("tr", {
  backgroundColor: "#fff6ed",
});

const WarningText = styled("td", {
  color: "#995200",
  padding: "16px 50px !important",
  fontSize: 12,
});

interface Props {
  node: ValidationNodeInfo;
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

  const cumulativeStakeAmount =
    node.cumulativeStakeAmount && new BN(node.cumulativeStakeAmount);
  if (node.currentStake && totalStake && cumulativeStakeAmount) {
    cumulativeStake =
      cumulativeStakeAmount.mul(new BN(10000)).div(totalStake).toNumber() / 100;
  }

  if (
    networkHolder.size === 0 &&
    totalStake &&
    cumulativeStakeAmount &&
    cumulativeStakeAmount.gt(totalStake.divn(3))
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

      {cumulativeStakeAmount && networkHolder.has(index) && (
        <CumulativeStakeholdersRow>
          <WarningText colSpan={8} className="text-center">
            {t("component.nodes.ValidatorRow.warning_tip", {
              node_tip_max: index,
            })}
          </WarningText>
        </CumulativeStakeholdersRow>
      )}
    </>
  );
};

export default ValidatorRow;
