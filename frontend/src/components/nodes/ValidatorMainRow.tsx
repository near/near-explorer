import BN from "bn.js";
import React, { FC } from "react";

import { Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Balance from "../utils/Balance";
import { OrderTableCell, TableRow } from "../utils/Table";
import CountryFlag from "../utils/CountryFlag";
import ValidatingLabel from "./ValidatingLabel";
import CumulativeStakeChart from "./CumulativeStakeChart";
import { StakingStatus } from "../../libraries/wamp/types";
import { styled } from "../../libraries/styles";

const ValidatorNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

const CollapseRowArrow = styled("td", {
  cursor: "pointer",
});

const StakeText = styled(ValidatorNodesText, {
  fontWeight: 700,
});

const ValidatorName = styled(Col, {
  maxWidth: 250,
  "@media (min-width: 1200px)": {
    maxWidth: 370,
  },
});

const ValidatorNameText = styled(ValidatorNodesText, {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const PublicKey = styled(ValidatorNameText, {
  color: "#2b9af4",
});

const ValidatorsNodeLabel = styled(Col, {
  marginRight: 24,
  maxWidth: 138,
});

const IconCellIcon = styled("img", {
  width: 16,
});

interface Props {
  isRowActive: boolean;
  accountId: string;
  index: number;
  countryCode?: string;
  country?: string;
  stakingStatus?: StakingStatus;
  publicKey?: string;
  validatorFee?: string | null;
  validatorDelegators?: number | string | null;
  currentStake?: string;
  proposedStakeForNextEpoch?: string;
  cumulativeStake: number;
  totalStakeInPersnt: number;
  handleClick: React.MouseEventHandler;
}

const yoctoNearToNear = new BN(1)
  .muln(10 ** 6)
  .muln(10 ** 6)
  .muln(10 ** 6)
  .muln(10 ** 6);

const ValidatorMainRow: FC<Props> = ({
  isRowActive,
  accountId,
  index,
  countryCode,
  country,
  stakingStatus,
  publicKey,
  validatorFee,
  validatorDelegators,
  currentStake,
  proposedStakeForNextEpoch,
  cumulativeStake,
  totalStakeInPersnt,
  handleClick,
}) => {
  const { t } = useTranslation();
  const stakeProposedAmount =
    currentStake &&
    proposedStakeForNextEpoch &&
    (new BN(currentStake).gt(new BN(proposedStakeForNextEpoch))
      ? {
          value: new BN(currentStake)
            .sub(new BN(proposedStakeForNextEpoch))
            .toString(),
          increace: false,
        }
      : new BN(currentStake).lt(new BN(proposedStakeForNextEpoch))
      ? {
          value: new BN(proposedStakeForNextEpoch)
            .sub(new BN(currentStake))
            .toString(),
          increace: true,
        }
      : undefined);

  return (
    <>
      <TableRow className="mx-0" collapse={isRowActive} key={accountId}>
        <CollapseRowArrow onClick={handleClick}>
          <IconCellIcon
            src={
              isRowActive
                ? "/static/images/icon-minimize.svg"
                : "/static/images/icon-maximize.svg"
            }
          />
        </CollapseRowArrow>

        <OrderTableCell>{index}</OrderTableCell>
        <td>
          <CountryFlag
            id={`country_flag_${accountId}`}
            countryCode={countryCode}
            country={country}
          />
        </td>

        <td>
          <Row noGutters className="align-items-center">
            <ValidatorsNodeLabel>
              {stakingStatus === "proposal" ? (
                <ValidatingLabel
                  type="proposal"
                  text={t(
                    "component.nodes.ValidatorMainRow.state.proposal.text"
                  )}
                  tooltipKey="nodes"
                >
                  {t("component.nodes.ValidatorMainRow.state.proposal.title")}
                </ValidatingLabel>
              ) : stakingStatus === "joining" ? (
                <ValidatingLabel
                  type="joining"
                  text={t(
                    "component.nodes.ValidatorMainRow.state.joining.text"
                  )}
                  tooltipKey="joining"
                >
                  {t("component.nodes.ValidatorMainRow.state.joining.title")}
                </ValidatingLabel>
              ) : stakingStatus === "leaving" ? (
                <ValidatingLabel
                  type="leaving"
                  text={t(
                    "component.nodes.ValidatorMainRow.state.leaving.text"
                  )}
                  tooltipKey="leaving"
                >
                  {t("component.nodes.ValidatorMainRow.state.leaving.title")}
                </ValidatingLabel>
              ) : stakingStatus === "active" ? (
                <ValidatingLabel
                  type="active"
                  text={t("component.nodes.ValidatorMainRow.state.active.text")}
                  tooltipKey="current"
                >
                  {t("component.nodes.ValidatorMainRow.state.active.title")}
                </ValidatingLabel>
              ) : stakingStatus === "idle" ? (
                <ValidatingLabel
                  type="idle"
                  text={t("component.nodes.ValidatorMainRow.state.idle.text")}
                  tooltipKey="idle"
                >
                  {t("component.nodes.ValidatorMainRow.state.idle.title")}
                </ValidatingLabel>
              ) : stakingStatus === "newcomer" ? (
                <ValidatingLabel
                  type="newcomer"
                  text={t(
                    "component.nodes.ValidatorMainRow.state.newcomer.text"
                  )}
                  tooltipKey="newcomer"
                >
                  {t("component.nodes.ValidatorMainRow.state.newcomer.title")}
                </ValidatingLabel>
              ) : stakingStatus === "on-hold" ? (
                <ValidatingLabel
                  type="on-hold"
                  text={t(
                    "component.nodes.ValidatorMainRow.state.on_hold.text"
                  )}
                  tooltipKey="on-hold"
                >
                  {t("component.nodes.ValidatorMainRow.state.on_hold.title")}
                </ValidatingLabel>
              ) : null}
            </ValidatorsNodeLabel>

            <ValidatorName>
              <Row noGutters>
                <ValidatorNameText title={`@${accountId}`}>
                  {accountId}
                </ValidatorNameText>
              </Row>
              {publicKey && (
                <Row noGutters>
                  <PublicKey title={publicKey}>{publicKey}</PublicKey>
                </Row>
              )}
            </ValidatorName>
          </Row>
        </td>

        <td>
          {validatorFee === undefined ? (
            <Spinner animation="border" size="sm" />
          ) : validatorFee === null ? (
            t("common.state.not_available")
          ) : (
            validatorFee
          )}
        </td>
        <td>
          {validatorDelegators === undefined ? (
            <Spinner animation="border" size="sm" />
          ) : validatorDelegators === null ? (
            t("common.state.not_available")
          ) : (
            validatorDelegators
          )}
        </td>
        <StakeText as="td" className="text-right">
          {currentStake ? (
            <Balance amount={currentStake} label="NEAR" fracDigits={0} />
          ) : proposedStakeForNextEpoch ? (
            <Balance
              amount={proposedStakeForNextEpoch}
              label="NEAR"
              fracDigits={0}
            />
          ) : (
            "-"
          )}
          {stakeProposedAmount && (
            <>
              <br />
              <small>
                {typeof stakeProposedAmount !== undefined && (
                  <>
                    {stakeProposedAmount.increace ? "+" : "-"}
                    {Number(
                      new BN(stakeProposedAmount.value).div(yoctoNearToNear)
                    ) < 1 ? (
                      <Balance
                        amount={stakeProposedAmount.value}
                        label="NEAR"
                        fracDigits={4}
                      />
                    ) : (
                      <Balance
                        amount={stakeProposedAmount.value}
                        label="NEAR"
                        fracDigits={0}
                      />
                    )}
                  </>
                )}
              </small>
            </>
          )}
        </StakeText>
        <td>
          <CumulativeStakeChart
            total={cumulativeStake - totalStakeInPersnt}
            current={cumulativeStake}
          />
        </td>
      </TableRow>
    </>
  );
};

export default ValidatorMainRow;
