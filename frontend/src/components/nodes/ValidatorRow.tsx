import BN from "bn.js";
import * as React from "react";
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

const ValidatorRow: React.FC<Props> = React.memo(
  ({ node, index, totalStake }) => {
    const { t } = useTranslation();
    const [isRowActive, setRowActive] = React.useState(false);
    const switchRowActive = React.useCallback(() => setRowActive((x) => !x), [
      setRowActive,
    ]);
    let totalStakeInPersnt = 0;
    let cumulativeStake = 0;

    if (node.currentStake && totalStake && !totalStake.isZero()) {
      totalStakeInPersnt =
        new BN(node.currentStake)
          .mul(new BN(10000))
          .div(totalStake)
          .toNumber() / 100;
    }

    const cumulativeStakeAmount =
      node.cumulativeStakeAmount && new BN(node.cumulativeStakeAmount);
    if (node.currentStake && totalStake && cumulativeStakeAmount) {
      cumulativeStake =
        cumulativeStakeAmount.mul(new BN(10000)).div(totalStake).toNumber() /
        100;
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
          stakingPoolInfo={node.stakingPoolInfo}
          proposedStakeForNextEpoch={node.proposedStake}
          currentStake={node.currentStake}
          cumulativeStake={cumulativeStake}
          totalStakeInPersnt={totalStakeInPersnt}
          handleClick={switchRowActive}
        />

        <ValidatorCollapsedRow
          isRowActive={isRowActive}
          progress={node.progress}
          nodeInfo={node.nodeInfo}
          poolDetails={node.poolDetails}
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
  }
);

export default ValidatorRow;
