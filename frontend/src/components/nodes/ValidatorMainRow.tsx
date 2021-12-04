import BN from "bn.js";
import React, { PureComponent } from "react";

import { Row, Col, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Translate } from "react-localize-redux";
import { countries } from "country-data";

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

class ValidatorMainRow extends PureComponent<Props> {
  render() {
    const {
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
    } = this.props;

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
      <Translate>
        {({ translate }) => (
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
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`${countryCode}_${index}`}>
                      {countryCode && typeof countryCode !== undefined
                        ? countries[countryCode.toUpperCase()]?.name ?? country
                        : country}
                    </Tooltip>
                  }
                >
                  <CountryFlag countryCode={countryCode} />
                </OverlayTrigger>
              </td>

              <td>
                <Row noGutters className="align-items-center">
                  <Col className="validators-node-label">
                    {stakingStatus === "proposal" ? (
                      <ValidatingLabel
                        type="proposal"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.proposal.text"
                        ).toString()}
                        tooltipKey="nodes"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.proposal.title"
                        )}
                      </ValidatingLabel>
                    ) : stakingStatus === "joining" ? (
                      <ValidatingLabel
                        type="joining"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.joining.text"
                        ).toString()}
                        tooltipKey="joining"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.joining.title"
                        )}
                      </ValidatingLabel>
                    ) : stakingStatus === "leaving" ? (
                      <ValidatingLabel
                        type="leaving"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.leaving.text"
                        ).toString()}
                        tooltipKey="leaving"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.leaving.title"
                        )}
                      </ValidatingLabel>
                    ) : stakingStatus === "active" ? (
                      <ValidatingLabel
                        type="active"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.active.text"
                        ).toString()}
                        tooltipKey="current"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.active.title"
                        )}
                      </ValidatingLabel>
                    ) : stakingStatus === "idle" ? (
                      <ValidatingLabel
                        type="idle"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.idle.text"
                        ).toString()}
                        tooltipKey="idle"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.idle.title"
                        )}
                      </ValidatingLabel>
                    ) : stakingStatus === "newcomer" ? (
                      <ValidatingLabel
                        type="newcomer"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.newcomer.text"
                        ).toString()}
                        tooltipKey="newcomer"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.newcomer.title"
                        )}
                      </ValidatingLabel>
                    ) : stakingStatus === "on-hold" ? (
                      <ValidatingLabel
                        type="on-hold"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.on_hold.text"
                        ).toString()}
                        tooltipKey="on-hold"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.on_hold.title"
                        )}
                      </ValidatingLabel>
                    ) : null}
                  </Col>

                  <Col className="validator-name">
                    <Row noGutters>
                      <Col
                        title={`@${accountId}`}
                        className="validator-nodes-text"
                      >
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
                  translate("common.state.not_available")
                ) : (
                  validatorFee
                )}
              </td>
              <td>
                {validatorDelegators === undefined ? (
                  <Spinner animation="border" size="sm" />
                ) : validatorDelegators === null ? (
                  translate("common.state.not_available")
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
                            new BN(stakeProposedAmount.value).div(
                              yoctoNearToNear
                            )
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
        )}
      </Translate>
    );
  }
}

export default ValidatorMainRow;
