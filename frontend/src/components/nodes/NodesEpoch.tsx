import React from "react";

import { Row, Col } from "react-bootstrap";

import ProgressBar from "../utils/ProgressBar";

class NodesEpoch extends React.PureComponent {
  render() {
    return (
      <Row className="nodes-epoch">
        <Col xs="12" className="nodes-epoch-content">
          <Row noGutters>
            <Col xs="7">
              <Row className="d-none d-md-flex">
                <Col>
                  Current Epoch Start:{" "}
                  <span className="text-value">Block #000000</span>
                </Col>
              </Row>

              <Row className="d-xs-flex d-md-none">
                <Col xs="12">Current Epoch Start</Col>
                <Col xs="12">
                  <span className="text-value">Block #000000</span>
                </Col>
              </Row>
            </Col>

            <Col sm="5" className="text-right d-none d-md-block">
              <span className="text-value">00% complete</span> (00:00:00
              remaining)
            </Col>

            <Col xs="5" className="text-right d-xs-block d-md-none">
              <ProgressBar
                percent={90}
                strokeColor="#37dbf4"
                trailColor="transparent"
                type="circle"
                strokeWidth={4}
                className="node-epoch-circle-progress"
                label={<span className="circle-progress-label">90%</span>}
              />
            </Col>
          </Row>
        </Col>
        <Col xs="12" className="d-none d-md-block px-0">
          <ProgressBar
            percent={50}
            strokeColor="#37dbf4"
            className="node-epoch-line-progress"
            trailColor="transparent"
          />
        </Col>
        <style global jsx>{`
          .nodes-epoch {
            background-color: #292526;
            color: #d5d4d8;
            font-size: 16px;
          }

          .nodes-epoch .nodes-epoch-content {
            margin: 15px 0;
          }

          .nodes-epoch .nodes-epoch-content .text-value {
            color: #37dbf4;
          }

          .node-epoch-line-progress {
            padding-left: 0;
            padding-right: 0;
            height: 4px;
          }

          .node-epoch-circle-progress {
            margin-left: auto;
            width: 40px;
          }

          .node-epoch-circle-progress .circle-progress-label {
            color: #d5d4d8;
          }
        `}</style>
      </Row>
    );
  }
}

export default NodesEpoch;
