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
  stakeProposed?: string;
  cumulativeStake: number;
  persntStake: number;
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
      stakeProposed,
      cumulativeStake,
      persntStake,
      handleClick,
    } = this.props;

    const stakeProposedAmount =
      stakeProposed &&
      (new BN(stake).gt(new BN(stakeProposed))
        ? {
            value: new BN(stake).sub(new BN(stakeProposed)).toString(),
            increace: false,
          }
        : new BN(stake).lt(new BN(stakeProposed))
        ? {
            value: new BN(stakeProposed).sub(new BN(stake)).toString(),
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
                        type="pending"
                        text={translate(
                          "component.nodes.ValidatorRow.state.pending.text"
                        ).toString()}
                        tooltipKey="nodes"
                      >
                        {translate(
                          "component.nodes.ValidatorRow.state.pending.title"
                        )}
                      </ValidatingLabel>
                    ) : validatorStatus === "new" ? (
                      <ValidatingLabel
                        type="new"
                        text={translate(
                          "component.nodes.ValidatorRow.state.new.text"
                        ).toString()}
                        tooltipKey="new"
                      >
                        {translate(
                          "component.nodes.ValidatorRow.state.new.title"
                        )}
                      </ValidatingLabel>
                    ) : validatorStatus === "leaving" ? (
                      <ValidatingLabel
                        type="kickout"
                        text={translate(
                          "component.nodes.ValidatorRow.state.kickout.text"
                        ).toString()}
                        tooltipKey="kickout"
                      >
                        {translate(
                          "component.nodes.ValidatorRow.state.kickout.title"
                        )}
                      </ValidatingLabel>
                    ) : validatorStatus === "active" ? (
                      <ValidatingLabel
                        type="active"
                        text={translate(
                          "component.nodes.ValidatorRow.state.active.text"
                        ).toString()}
                        tooltipKey="current"
                      >
                        {translate(
                          "component.nodes.ValidatorRow.state.active.title"
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
                {validatorFee ?? <Spinner animation="border" size="sm" />}
              </td>
              <td>
                {validatorDelegators ?? (
                  <Spinner animation="border" size="sm" />
                )}
              </td>
              <td className="text-right validator-nodes-text stake-text">
                {stake ? <Balance amount={stake} label="NEAR" /> : "-"}
                {stakeProposedAmount && (
                  <>
                    <br />
                    <small>
                      {typeof stakeProposedAmount === "string" ? (
                        "same"
                      ) : (
                        <>
                          {stakeProposedAmount.increace ? "+" : "-"}
                          <Balance
                            amount={stakeProposedAmount.value}
                            label="NEAR"
                          />
                        </>
                      )}
                    </small>
                  </>
                )}
              </td>
              <td>
                <CumulativeStakeChart
                  total={cumulativeStake - persntStake}
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
