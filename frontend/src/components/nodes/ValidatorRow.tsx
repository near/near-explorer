import BN from "bn.js";
import * as React from "react";
import { Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";

import ValidatorMainRow from "./ValidatorMainRow";
import ValidatorCollapsedRow from "./ValidatorCollapsedRow";

import { styled } from "../../libraries/styles";
import { FRACTION_DIGITS } from "./CumulativeStakeChart";
import { ValidatorFullData } from "../../types/common";
import ValidatingLabel, { StakingStatus } from "./ValidatingLabel";

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
  validator: ValidatorFullData;
  index: number;
  totalStake: BN;
  cumulativeStake: BN;
  isNetworkHolder: boolean;
  seatPrice?: string;
}

const ZERO = new BN(0);
const EXTRA_PRECISION_MULTIPLIER = Math.pow(10, 2 + FRACTION_DIGITS);

const getStakingStatus = (
  validator: ValidatorFullData,
  seatPrice?: string
): StakingStatus | null => {
  if (validator.currentEpoch) {
    if (validator.nextEpoch) {
      return "active";
    } else {
      return "leaving";
    }
  } else {
    if (validator.nextEpoch) {
      return "joining";
    } else {
      if (validator.afterNextEpoch) {
        return "proposal";
      } else {
        if (!seatPrice) {
          return null;
        }
        const contractStake = validator.contractStake
          ? new BN(validator.contractStake)
          : undefined;
        if (!contractStake) {
          return null;
        }
        const seatPriceBN = new BN(seatPrice);
        if (contractStake.gte(seatPriceBN)) {
          return "onHold";
        } else if (contractStake.gte(seatPriceBN.muln(20).divn(100))) {
          return "newcomer";
        } else {
          return "idle";
        }
      }
    }
  }
};

const ValidatorRow: React.FC<Props> = React.memo(
  ({
    validator,
    index,
    totalStake,
    cumulativeStake,
    isNetworkHolder,
    seatPrice,
  }) => {
    const { t } = useTranslation();
    const [isRowActive, setRowActive] = React.useState(false);
    const switchRowActive = React.useCallback(() => setRowActive((x) => !x), [
      setRowActive,
    ]);

    const visibleStake =
      validator.currentEpoch?.stake ??
      validator.nextEpoch?.stake ??
      validator.afterNextEpoch?.stake ??
      validator.contractStake;

    const currentStake = validator.currentEpoch?.stake;
    const nextVisibleStake =
      validator.nextEpoch?.stake ?? validator.afterNextEpoch?.stake;

    const stakeDelta =
      validator.currentEpoch?.stake && nextVisibleStake
        ? new BN(nextVisibleStake).sub(new BN(validator.currentEpoch.stake))
        : undefined;

    const stakePercents = React.useMemo(() => {
      if (!validator.currentEpoch) {
        return null;
      }
      const stake = currentStake ? new BN(currentStake) : ZERO;
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
    }, [totalStake, currentStake, cumulativeStake]);

    const stakingStatus = getStakingStatus(validator, seatPrice);

    return (
      <>
        <ValidatorMainRow
          isRowActive={isRowActive}
          accountId={validator.accountId}
          index={index + 1}
          countryCode={validator.description?.countryCode}
          country={validator.description?.country}
          publicKey={validator.publicKey}
          poolInfo={validator.poolInfo}
          stakePercents={stakePercents}
          handleClick={switchRowActive}
          visibleStake={visibleStake}
          stakeDelta={stakeDelta}
        >
          {stakingStatus ? <ValidatingLabel type={stakingStatus} /> : null}
        </ValidatorMainRow>

        <ValidatorCollapsedRow
          isRowActive={isRowActive}
          progress={validator.currentEpoch?.progress}
          telemetry={validator.telemetry}
          description={validator.description}
        />

        {isNetworkHolder && (
          <CumulativeStakeholdersRow>
            <WarningText colSpan={8} className="text-center">
              {t("component.nodes.ValidatorRow.warning_tip", {
                node_tip_max: index + 1,
              })}
            </WarningText>
          </CumulativeStakeholdersRow>
        )}
      </>
    );
  }
);

export default ValidatorRow;
