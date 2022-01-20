import BN from "bn.js";
import React, { FC } from "react";

import { Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import * as N from "../../libraries/explorer-wamp/nodes";

import Balance from "../utils/Balance";
import { TableRow } from "../utils/Table";
import CountryFlag from "../utils/CountryFlag";
import ValidatingLabel from "./ValidatingLabel";
import CumulativeStakeChart from "./CumulativeStakeChart";

interface Props {
  isRowActive: boolean;
  accountId: string;
  index: number;
  countryCode?: string;
  country?: string;
  stakingStatus?: N.StakingStatus;
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
      <TableRow
        className="validator-nodes-row mx-0"
        collapse={isRowActive}
        key={accountId}
      >
        <td className="collapse-row-arrow" onClick={handleClick}>
          {isRowActive ? (
            <img
              src="/static/images/icon-minimize.svg"
              style={{ width: "16px" }}
            />
          ) : (
            <img
              src="/static/images/icon-maximize.svg"
              style={{ width: "16px" }}
            />
          )}
        </td>

        <td className="order">{index}</td>
        <td className="country-flag">
          <CountryFlag
            id={`country_flag_${accountId}`}
            countryCode={countryCode}
            country={country}
          />
        </td>

        <td>
          <Row noGutters className="align-items-center">
            <Col className="validators-node-label">
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
            </Col>

            <Col className="validator-name">
              <Row noGutters>
                <Col title={`@${accountId}`} className="validator-nodes-text">
                  {accountId}
                </Col>
              </Row>
              {publicKey && (
                <Row noGutters>
                  <Col
                    title={publicKey}
                    className="validator-nodes-text validator-node-pub-key"
                  >
                    {publicKey}
                  </Col>
                </Row>
              )}
            </Col>
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
        <td className="text-right validator-nodes-text stake-text">
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
        </td>
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
