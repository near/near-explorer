import React from "react";
import moment from "moment";

import { Row, Col } from "react-bootstrap";

import ProgressBar from "../utils/ProgressBar";
import { BlockInfo } from "../../libraries/explorer-wamp/blocks";

interface Props {
  epochStartHeight: number;
  epochStartBlock?: BlockInfo;
}

interface State {
  timeRemaining?: number;
  epochProseed: number;
}

class NodesEpoch extends React.PureComponent<Props, State> {
  state = {
    timeRemaining: undefined,
    epochProseed: 0,
  };

  componentDidMount() {
    this.timer = setInterval(() => this.epochDuration(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  epochDuration = () => {
    if (this.props.epochStartBlock?.timestamp) {
      const currentTimestamp = moment() as moment.Moment;
      const endEpochTimestamp = moment(
        this.props.epochStartBlock.timestamp
      ).add(12, "h");
      const duration = moment
        .duration(
          endEpochTimestamp.diff(moment(this.props.epochStartBlock.timestamp))
        )
        .asSeconds();
      const durationProseed = moment
        .duration(
          currentTimestamp.diff(moment(this.props.epochStartBlock.timestamp))
        )
        .asSeconds();
      const durationValue = (durationProseed / duration) * 100;
      this.setState({
        timeRemaining: moment
          .duration(endEpochTimestamp.diff(currentTimestamp))
          .asMilliseconds(),
        epochProseed: Number(durationValue.toFixed(2)),
      });
    }
    return null;
  };

  render() {
    const { epochProseed, timeRemaining } = this.state;

    return (
      <Row className="nodes-epoch">
        <Col xs="12" className="nodes-epoch-content">
          <Row noGutters>
            <Col xs="7">
              <Row className="d-none d-md-flex">
                <Col>
                  Current Epoch Start:{" "}
                  <span className="text-value">
                    Block #{this.props.epochStartHeight ?? "00000000"}
                  </span>
                </Col>
              </Row>

              <Row className="d-xs-flex d-md-none">
                <Col xs="12">Current Epoch Start</Col>
                <Col xs="12">
                  <span className="text-value">
                    Block #{this.props.epochStartHeight ?? "00000000"}
                  </span>
                </Col>
              </Row>
            </Col>

            <Col sm="5" className="text-right d-none d-md-block ">
              <span className="text-value persnt-remains">
                {epochProseed.toFixed(0)}% complete
              </span>{" "}
              (
              {timeRemaining
                ? moment(timeRemaining)?.format("HH:mm:ss")
                : "00:00:00"}{" "}
              remaining)
            </Col>

            <Col xs="5" className="text-right d-xs-block d-md-none">
              <ProgressBar
                percent={epochProseed}
                strokeColor="#37dbf4"
                trailColor="transparent"
                type="circle"
                strokeWidth={4}
                className="node-epoch-circle-progress"
                label={
                  <span className="circle-progress-label">
                    {epochProseed.toFixed(0)}%
                  </span>
                }
              />
            </Col>
          </Row>
        </Col>
        <Col xs="12" className="d-none d-md-block px-0">
          <ProgressBar
            percent={epochProseed}
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
            font-weight: 500;
          }

          .nodes-epoch .nodes-epoch-content {
            margin: 15px 0;
          }

          .nodes-epoch .nodes-epoch-content .text-value {
            color: #37dbf4;
          }

          .nodes-epoch .nodes-epoch-content .text-value.persnt-remains {
            font-weight: 700;
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
