import * as React from "react";
import moment from "moment";

import { Row, Col } from "react-bootstrap";

import ProgressBar from "../utils/ProgressBar";

import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

const NodesEpochContent = styled(Col, {
  margin: "15px 0",
});

const TextValue = styled("span", {
  color: "#37dbf4",
});
const TextValueRemainedPercent = styled(TextValue, {
  fontWeight: 700,
});

const NodesEpochRow = styled(Row, {
  backgroundColor: "#292526",
  color: "#d5d4d8",
  fontSize: 16,
  fontWeight: 500,
});

const NodesEpochLineProgress = styled(ProgressBar, {
  paddingHorizontal: 0,
  height: 4,
});

const NodesEpochCircleProgress = styled(ProgressBar, {
  marginLeft: "auto",
  width: 40,
});

const NodesEpochCircleProgressLabel = styled("span", {
  color: "#d5d4d8",
});

interface Props {
  epochLength: number;
  epochStartHeight: number;
  latestBlockHeight: number;
  epochStartTimestamp: number;
  latestBlockTimestamp: number;
}

const NodesEpoch: React.FC<Props> = React.memo(
  ({
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
      <NodesEpochRow>
        <NodesEpochContent xs="12">
          <Row noGutters>
            <Col xs="7">
              <Row className="d-none d-md-flex">
                <Col>
                  {t("component.nodes.NodesEpoch.current_epoch_start") + ": "}
                  <TextValue>
                    {t("component.nodes.NodesEpoch.block") + " #"}
                    {epochStartHeight}
                  </TextValue>
                </Col>
              </Row>

              <Row className="d-xs-flex d-md-none">
                <Col xs="12">
                  {t("component.nodes.NodesEpoch.current_epoch_start")}
                </Col>
                <Col xs="12">
                  <TextValue>
                    {t("component.nodes.NodesEpoch.block") + " #"}
                    {epochStartHeight}
                  </TextValue>
                </Col>
              </Row>
            </Col>

            <Col sm="5" className="text-right d-none d-md-block ">
              <TextValueRemainedPercent>
                {epochProgress.toFixed(0)}
                {"% " + t("component.nodes.NodesEpoch.complete")}
              </TextValueRemainedPercent>
              {` (${moment.utc(timeRemaining).format("HH:mm:ss")} ${t(
                "component.nodes.NodesEpoch.remaining"
              )})`}
            </Col>

            <Col xs="5" className="text-right d-xs-block d-md-none">
              <NodesEpochCircleProgress
                percent={epochProgress}
                strokeColor="#37dbf4"
                trailColor="transparent"
                type="circle"
                strokeWidth={4}
                label={
                  <NodesEpochCircleProgressLabel>
                    {epochProgress.toFixed(0)}%
                  </NodesEpochCircleProgressLabel>
                }
              />
            </Col>
          </Row>
        </NodesEpochContent>
        <Col xs="12" className="d-none d-md-block px-0">
          <NodesEpochLineProgress
            percent={epochProgress}
            strokeColor="#37dbf4"
            trailColor="transparent"
          />
        </Col>
      </NodesEpochRow>
    );
  }
);

export default NodesEpoch;
