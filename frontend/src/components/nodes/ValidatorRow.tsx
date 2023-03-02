import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";

import { ValidatorFullData } from "@explorer/common/types/procedures";
import { FRACTION_DIGITS } from "@explorer/frontend/components/nodes/CumulativeStakeChart";
import ValidatingLabel, {
  StakingStatus,
} from "@explorer/frontend/components/nodes/ValidatingLabel";
import ValidatorCollapsedRow from "@explorer/frontend/components/nodes/ValidatorCollapsedRow";
import ValidatorMainRow from "@explorer/frontend/components/nodes/ValidatorMainRow";
import * as BI from "@explorer/frontend/libraries/bigint";
import { styled } from "@explorer/frontend/libraries/styles";

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
  totalStake: JSBI;
  cumulativeStake: JSBI;
  isNetworkHolder: boolean;
  seatPrice?: string;
}

const EXTRA_PRECISION_MULTIPLIER = 10 ** (2 + FRACTION_DIGITS);

const getStakingStatus = (
  validator: ValidatorFullData,
  seatPrice?: string
): StakingStatus | null => {
  if (validator.currentEpoch) {
    if (validator.nextEpoch) {
      return "active";
    }
    return "leaving";
  }
  if (validator.nextEpoch) {
    return "joining";
  }
  if (validator.afterNextEpoch) {
    return "proposal";
  }
  if (!seatPrice) {
    return null;
  }
  const contractStake = validator.contractStake
    ? JSBI.BigInt(validator.contractStake)
    : undefined;
  if (!contractStake) {
    return null;
  }
  const seatPriceBN = JSBI.BigInt(seatPrice);
  if (JSBI.greaterThanOrEqual(contractStake, seatPriceBN)) {
    return "onHold";
  }
  if (
    JSBI.greaterThanOrEqual(
      contractStake,
      JSBI.divide(JSBI.multiply(seatPriceBN, JSBI.BigInt(20)), JSBI.BigInt(100))
    )
  ) {
    return "newcomer";
  }
  return "idle";
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
    const switchRowActive = React.useCallback(
      () => setRowActive((x) => !x),
      [setRowActive]
    );

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
        ? JSBI.subtract(
            JSBI.BigInt(nextVisibleStake),
            JSBI.BigInt(validator.currentEpoch.stake)
          )
        : undefined;

    const stakePercents = React.useMemo(() => {
      if (!validator.currentEpoch) {
        return null;
      }
      const stake = currentStake ? JSBI.BigInt(currentStake) : BI.zero;
      const ownPercent = JSBI.equal(totalStake, BI.zero)
        ? 0
        : JSBI.toNumber(
            JSBI.divide(
              JSBI.multiply(stake, JSBI.BigInt(EXTRA_PRECISION_MULTIPLIER)),
              totalStake
            )
          );
      const cumulativeStakePercent = JSBI.equal(totalStake, BI.zero)
        ? 0
        : JSBI.toNumber(
            JSBI.divide(
              JSBI.multiply(
                cumulativeStake,
                JSBI.BigInt(EXTRA_PRECISION_MULTIPLIER)
              ),
              totalStake
            )
          );
      return {
        ownPercent: ownPercent / EXTRA_PRECISION_MULTIPLIER,
        cumulativePercent: cumulativeStakePercent / EXTRA_PRECISION_MULTIPLIER,
      };
    }, [validator.currentEpoch, currentStake, totalStake, cumulativeStake]);

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
