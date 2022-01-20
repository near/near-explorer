import { FC } from "react";
import moment from "moment";

import { Row, Col } from "react-bootstrap";

import ProgressBar from "../utils/ProgressBar";

import { useTranslation } from "react-i18next";

interface Props {
  epochLength: number;
  epochStartHeight: number;
  latestBlockHeight: number;
  epochStartTimestamp: number;
  latestBlockTimestamp: number;
}

const NodesEpoch: FC<Props> = ({
  epochStartHeight,
  latestBlockHeight,
  epochLength,
  epochStartTimestamp,
  latestBlockTimestamp,
}) => {
  const { t } = useTranslation();
  const epochProgress =
    ((latestBlockHeight - epochStartHeight) / epochLength) * 100;
  const timeRemaining =
    ((latestBlockTimestamp - epochStartTimestamp) / epochProgress) *
    (100 - epochProgress);

  return (
    <Row className="nodes-epoch">
      <Col xs="12" className="nodes-epoch-content">
        <Row noGutters>
          <Col xs="7">
            <Row className="d-none d-md-flex">
              <Col>
                {t("component.nodes.NodesEpoch.current_epoch_start") + ": "}
                <span className="text-value">
                  {t("component.nodes.NodesEpoch.block") + " #"}
                  {epochStartHeight}
                </span>
              </Col>
            </Row>

            <Row className="d-xs-flex d-md-none">
              <Col xs="12">
                {t("component.nodes.NodesEpoch.current_epoch_start")}
              </Col>
              <Col xs="12">
                <span className="text-value">
                  {t("component.nodes.NodesEpoch.block") + " #"}
                  {epochStartHeight}
                </span>
              </Col>
            </Row>
          </Col>

          <Col sm="5" className="text-right d-none d-md-block ">
            <span className="text-value persnt-remains">
              {epochProgress.toFixed(0)}
              {"% " + t("component.nodes.NodesEpoch.complete")}
            </span>
            {` (${moment.utc(timeRemaining).format("HH:mm:ss")} ${t(
              "component.nodes.NodesEpoch.remaining"
            )})`}
          </Col>

          <Col xs="5" className="text-right d-xs-block d-md-none">
            <ProgressBar
              percent={epochProgress}
              strokeColor="#37dbf4"
              trailColor="transparent"
              type="circle"
              strokeWidth={4}
              className="node-epoch-circle-progress"
              label={
                <span className="circle-progress-label">
                  {epochProgress.toFixed(0)}%
                </span>
              }
            />
          </Col>
        </Row>
      </Col>
      <Col xs="12" className="d-none d-md-block px-0">
        <ProgressBar
          percent={epochProgress}
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
};

export default NodesEpoch;
