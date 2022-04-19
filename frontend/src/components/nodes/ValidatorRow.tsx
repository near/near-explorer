import BN from "bn.js";
import * as React from "react";
import { Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";

import ValidatorMainRow from "./ValidatorMainRow";
import ValidatorCollapsedRow from "./ValidatorCollapsedRow";
import { ValidationNodeInfo } from "../../libraries/wamp/types";

import { styled } from "../../libraries/styles";
import { FRACTION_DIGITS } from "./CumulativeStakeChart";

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
  totalStake: BN;
  cumulativeStake: BN;
  isNetworkHolder: boolean;
}

const ZERO = new BN(0);
const EXTRA_PRECISION_MULTIPLIER = Math.pow(10, 2 + FRACTION_DIGITS);

const ValidatorRow: React.FC<Props> = React.memo(
  ({ node, index, totalStake, cumulativeStake, isNetworkHolder }) => {
    const { t } = useTranslation();
    const [isRowActive, setRowActive] = React.useState(false);
    const switchRowActive = React.useCallback(() => setRowActive((x) => !x), [
      setRowActive,
    ]);

    const stakePercents = React.useMemo(() => {
      if (
        !node.stakingStatus ||
        !["active", "leaving"].includes(node.stakingStatus)
      ) {
        return null;
      }
      const stake = node.currentStake ? new BN(node.currentStake) : ZERO;
      const ownPercent = totalStake.isZero()
        ? 0
        : stake.muln(EXTRA_PRECISION_MULTIPLIER).div(totalStake).toNumber();
      const cumulativeStakePercent = totalStake.isZero()
        ? 0
        : cumulativeStake
            .muln(EXTRA_PRECISION_MULTIPLIER)
            .div(totalStake)
            .toNumber();
      return {
        ownPercent: ownPercent / EXTRA_PRECISION_MULTIPLIER,
        cumulativePercent: cumulativeStakePercent / EXTRA_PRECISION_MULTIPLIER,
      };
    }, [totalStake, node.currentStake, cumulativeStake]);

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
          stakePercents={stakePercents}
          handleClick={switchRowActive}
        />

        <ValidatorCollapsedRow
          isRowActive={isRowActive}
          progress={node.progress}
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

        {isNetworkHolder && (
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
