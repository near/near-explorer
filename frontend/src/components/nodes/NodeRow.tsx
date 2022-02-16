import { FC, useState, useCallback } from "react";
import { Badge, Row, Col } from "react-bootstrap";

import { TableRow, TableCollapseRow, OrderTableCell } from "../utils/Table";
import Term from "../utils/Term";
import Timer from "../utils/Timer";
import TransactionLink from "../utils/TransactionLink";
import ValidatingLabel from "./ValidatingLabel";

import { useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import { NodeInfo } from "../../libraries/wamp/types";
import { styled } from "../../libraries/styles";

const OnlineNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

const OnlineNodeLabel = styled(Col, {
  marginRight: 24,
  flex: "0 0 auto",
  width: 55,
});

const OnlineNodesContentRow = styled(Row, {
  paddingTop: 16,
  paddingBottom: 16,
  "& > .col": {
    padding: "0 22px",
    borderRight: "1px solid #e5e5e6",
  },
  "& > .col:last-child": {
    borderRight: "none",
  },
});

const OnlineNodesDetailsTitle = styled(Col, {
  display: "flex",
  flexWrap: "nowrap",
  fontSize: 12,
  color: "#a2a2a8",
});

export const AgentNameBadge = styled(Badge, {
  backgroundColor: "#f0f0f1",
  color: "#72727a",
  fontWeight: 500,
  fontSize: 12,
  fontFamily: '"Roboto Mono", monospace',
});

const NodeStatus = styled(Col, {
  fontSize: 12,
  lineHeight: "18px",
  color: "#4a4f54",
});

const IconCell = styled("td", {
  width: 48,
});

const IconCellIcon = styled("img", {
  width: 16,
});

const LocalOrderTableCell = styled(OrderTableCell, {
  width: 48,
});

interface Props {
  node: NodeInfo;
  index: number;
}

export const statusIdentifier = new Map([
  ["AwaitingPeers", "Waiting for peers"],
  ["HeaderSync", "Syncing headers"],
  ["BlockSync", "Syncing blocks"],
  ["StateSync", "Syncing state"],
  ["StateSyncDone", "State sync is done"],
  ["BodySync", "Syncing body"],
  ["NoSync", ""],
]);

const NodeRow: FC<Props> = ({ node, index }) => {
  const { t } = useTranslation();
  const [isRowActive, setRowActive] = useState(false);
  const switchRowActive = useCallback(() => setRowActive((x) => !x), [
    setRowActive,
  ]);
  const latestBlockHeight = useLatestBlockHeight();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap"
        rel="stylesheet"
      />

      <TableRow
        className="online-nodes-row"
        collapse={isRowActive}
        key={node.accountId}
      >
        <IconCell onClick={switchRowActive}>
          <IconCellIcon
            src={
              isRowActive
                ? "/static/images/icon-minimize.svg"
                : "/static/images/icon-maximize.svg"
            }
          />
        </IconCell>

        <LocalOrderTableCell>{index}</LocalOrderTableCell>

        <td>
          <Row noGutters className="align-items-center">
            <OnlineNodeLabel xs="2">
              <ValidatingLabel
                type="active"
                text={t("component.nodes.NodeRow.online.text")}
                tooltipKey="nodes"
              >
                {t("component.nodes.NodeRow.online.title")}
              </ValidatingLabel>
            </OnlineNodeLabel>

            <Col xs="10">
              <Row noGutters>
                {node.accountId && (
                  <OnlineNodesText title={`@${node.accountId}`}>
                    {node.accountId.substring(0, 20)}...
                  </OnlineNodesText>
                )}
              </Row>
              {node.status && (
                <Row>
                  <NodeStatus>{statusIdentifier.get(node.status)}</NodeStatus>
                </Row>
              )}
              {node.nodeId && (
                <Row noGutters>
                  <OnlineNodesText title={node.nodeId}>
                    <TransactionLink transactionHash={node.nodeId} />
                  </OnlineNodesText>
                </Row>
              )}
            </Col>
          </Row>
        </td>
      </TableRow>

      <TableCollapseRow collapse={isRowActive}>
        <td colSpan={3}>
          <OnlineNodesContentRow noGutters>
            <Col xs="3">
              <Row noGutters>
                <OnlineNodesDetailsTitle>
                  <Term
                    title={"Latest block"}
                    text={"Latest block explain text"}
                  />
                </OnlineNodesDetailsTitle>
              </Row>
              <Row noGutters>
                {node && (
                  <OnlineNodesText
                    className={
                      latestBlockHeight === undefined
                        ? undefined
                        : Math.abs(
                            node.lastHeight - latestBlockHeight.toNumber()
                          ) > 1000
                        ? "text-danger"
                        : Math.abs(
                            node.lastHeight - latestBlockHeight.toNumber()
                          ) > 50
                        ? "text-warning"
                        : undefined
                    }
                    md={3}
                  >
                    {` ${node.lastHeight}`}
                  </OnlineNodesText>
                )}
              </Row>
            </Col>

            <Col xs="3">
              <Row noGutters>
                <OnlineNodesDetailsTitle>
                  <Term
                    title={"Latest Telemetry Update"}
                    text={"Latest Telemetry Update explain text"}
                  />
                </OnlineNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <OnlineNodesText>
                  {node?.lastSeen ? <Timer time={node.lastSeen} /> : "..."}
                </OnlineNodesText>
              </Row>
            </Col>

            <Col xs="3">
              <Row noGutters>
                <OnlineNodesDetailsTitle>
                  <Term
                    title={"Node Agent Name"}
                    text={"Node Agent Name explain text"}
                  />
                </OnlineNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <Col>
                  {node ? (
                    <AgentNameBadge variant="secondary">
                      {node.agentName}
                    </AgentNameBadge>
                  ) : (
                    "..."
                  )}
                </Col>
              </Row>
            </Col>

            <Col xs="3">
              <Row noGutters>
                <OnlineNodesDetailsTitle>
                  <Term
                    title={"Node Agent Version / Build"}
                    text={"Node Agent Version / Build explain text"}
                  />
                </OnlineNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <Col>
                  {node ? (
                    <AgentNameBadge variant="secondary">
                      {" "}
                      v{node.agentVersion} / {node.agentBuild}
                    </AgentNameBadge>
                  ) : (
                    "..."
                  )}
                </Col>
              </Row>
            </Col>
          </OnlineNodesContentRow>
        </td>
      </TableCollapseRow>
    </>
  );
};

export default NodeRow;
