import BN from "bn.js";
import React, { PureComponent } from "react";

import { Row, Col, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Translate } from "react-localize-redux";
import { countries } from "country-data";

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
  validatorStatus?: "active" | "new" | "leaving" | "proposal";
  publicKey?: string;
  validatorFee: string | null;
  validatorDelegators: number | string | null;
  stake: string;
  proposedStakeForNextEpoch?: string;
  cumulativeStake: number;
  totalStakeInPersnt: number;
  handleClick: React.MouseEventHandler;
}

class ValidatorMainRow extends PureComponent<Props> {
  render() {
    const {
      isRowActive,
      accountId,
      index,
      countryCode,
      country,
      validatorStatus,
      publicKey,
      validatorFee,
      validatorDelegators,
      stake,
      proposedStakeForNextEpoch,
      cumulativeStake,
      totalStakeInPersnt,
      handleClick,
    } = this.props;

    const stakeProposedAmount =
      proposedStakeForNextEpoch &&
      (new BN(stake).gt(new BN(proposedStakeForNextEpoch))
        ? {
            value: new BN(stake)
              .sub(new BN(proposedStakeForNextEpoch))
              .toString(),
            increace: false,
          }
        : new BN(stake).lt(new BN(proposedStakeForNextEpoch))
        ? {
            value: new BN(proposedStakeForNextEpoch)
              .sub(new BN(stake))
              .toString(),
            increace: true,
          }
        : "same");

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
                        ? countries[countryCode.toUpperCase()].name
                        : country}
                    </Tooltip>
                  }
                >
                  <CountryFlag countryCode={countryCode} />
                </OverlayTrigger>
              </td>

              <td>
                <Row noGutters className="align-items-center">
                  <Col xs="2" className="validators-node-label">
                    {validatorStatus === "proposal" ? (
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
                    ) : validatorStatus === "new" ? (
                      <ValidatingLabel
                        type="new"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.new.text"
                        ).toString()}
                        tooltipKey="new"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.new.title"
                        )}
                      </ValidatingLabel>
                    ) : validatorStatus === "leaving" ? (
                      <ValidatingLabel
                        type="kickout"
                        text={translate(
                          "component.nodes.ValidatorMainRow.state.kickout.text"
                        ).toString()}
                        tooltipKey="kickout"
                      >
                        {translate(
                          "component.nodes.ValidatorMainRow.state.kickout.title"
                        )}
                      </ValidatingLabel>
                    ) : validatorStatus === "active" ? (
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
                    ) : (
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
                    )}
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
                {validatorFee ?? <Spinner animation="border" size="sm" />}
              </td>
              <td>
                {validatorDelegators ?? (
                  <Spinner animation="border" size="sm" />
                )}
              </td>
              <td className="text-right validator-nodes-text stake-text">
                {stake ? (
                  <Balance amount={stake} label="NEAR" fracDigits={0} />
                ) : (
                  "-"
                )}
                {stakeProposedAmount && (
                  <>
                    <br />
                    <small>
                      {typeof stakeProposedAmount === "string" ? (
                        <>
                          {translate(
                            "component.nodes.ValidatorMainRow.same_proposed_stake"
                          )}
                        </>
                      ) : (
                        <>
                          {stakeProposedAmount.increace ? "+" : "-"}
                          <Balance
                            amount={stakeProposedAmount.value}
                            label="NEAR"
                            fracDigits={0}
                          />
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
