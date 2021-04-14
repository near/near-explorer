import BN from "bn.js";
import React from "react";
import { Row, Col } from "react-bootstrap";

import * as N from "../../libraries/explorer-wamp/nodes";
import Balance from "../utils/Balance";
import { TableRow } from "../utils/Table";
import ValidatingLabel from "./ValidatingLabel";
import CumulativeStakeChart from "./CumuativeStakeChart";

interface Props {
  node: N.Proposal;
  index: number;
  totalStake: BN;
  cumulativeStakeAmount: BN;
}

class ProposalRow extends React.PureComponent<Props> {
  render() {
    const { node, index, totalStake, cumulativeStakeAmount } = this.props;
    let persntStake = 0;
    let cumulativeStake = 0;

    if (node.stake) {
      persntStake =
        new BN(node.stake).mul(new BN(10000)).div(totalStake).toNumber() / 100;
    }

    if (cumulativeStakeAmount) {
      cumulativeStake =
        new BN(cumulativeStakeAmount)
          .mul(new BN(10000))
          .div(totalStake)
          .toNumber() / 100;
    }
    return (
      <TableRow className="proposal-row">
        <td />
        <td className="order">{index}</td>
        <td>
          <Row noGutters className="align-items-center">
            <Col xs="2" className="proposal-label">
              <ValidatingLabel
                type="pending"
                text="node staked to be new validating one"
                tooltipKey="nodes"
              >
                Pending
              </ValidatingLabel>
            </Col>
            <Col>
              <Col xs="12" title={`@${node.account_id}`}>
                {node.account_id.substring(0, 20)}...
              </Col>
              <Col xs="12" title={node.public_key}>
                {node.public_key.substring(8, 20)}...
              </Col>
            </Col>
          </Row>
        </td>
        <td>{node.stake ? <Balance amount={node.stake} /> : "-"}</td>
        <td>
          <CumulativeStakeChart
            value={{
              total: cumulativeStake - persntStake,
              current: cumulativeStake,
            }}
          />
        </td>
        <style global jsx>{`
          .proposal-label {
            margin-right: 24px;
          }
        `}</style>
      </TableRow>
    );
  }
}

export default ProposalRow;
