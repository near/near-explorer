import { FC, useState, useCallback } from "react";
import { Badge, Row, Col } from "react-bootstrap";

import * as N from "../../libraries/explorer-wamp/nodes";
import { DatabaseConsumer } from "../../context/DatabaseProvider";

import { TableRow, TableCollapseRow } from "../utils/Table";
import Term from "../utils/Term";
import Timer from "../utils/Timer";
import TransactionLink from "../utils/TransactionLink";
import ValidatingLabel from "./ValidatingLabel";

import { useTranslation } from "react-i18next";

interface Props {
  node: N.NodeInfo;
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
  return (
    <DatabaseConsumer>
      {(context) => (
        <>
          <TableRow
            className="online-nodes-row"
            collapse={isRowActive}
            key={node.accountId}
          >
            <td onClick={switchRowActive} style={{ width: "48px" }}>
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

            <td className="order" style={{ width: "48px" }}>
              {index}
            </td>

            <td>
              <Row noGutters className="align-items-center">
                <Col xs="2" className="online-node-label">
                  <ValidatingLabel
                    type="active"
                    text={t("component.nodes.NodeRow.online.text")}
                    tooltipKey="nodes"
                  >
                    {t("component.nodes.NodeRow.online.title")}
                  </ValidatingLabel>
                </Col>

                <Col xs="10">
                  <Row noGutters>
                    {node.accountId && (
                      <Col
                        title={`@${node.accountId}`}
                        className="online-nodes-text"
                      >
                        {node.accountId.substring(0, 20)}...
                      </Col>
                    )}
                  </Row>
                  {node.status && (
                    <Row>
                      <Col className="node-status">
                        {statusIdentifier.get(node.status)}
                      </Col>
                    </Row>
                  )}
                  {node.nodeId && (
                    <Row noGutters>
                      <Col title={node.nodeId} className="online-nodes-text">
                        <TransactionLink transactionHash={node.nodeId} />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </td>
          </TableRow>

          <TableCollapseRow
            className="online-nodes-details-row"
            collapse={isRowActive}
          >
            <td colSpan={3}>
              <Row noGutters className="online-nodes-content-row">
                <Col xs="3" className="online-nodes-content-cell">
                  <Row noGutters>
                    <Col className="online-nodes-details-title">
                      <Term
                        title={"Latest block"}
                        text={"Latest block explain text"}
                      />
                    </Col>
                  </Row>
                  <Row noGutters>
                    {node && (
                      <Col
                        className={`${
                          typeof context.latestBlockHeight === "undefined"
                            ? ""
                            : Math.abs(
                                node.lastHeight -
                                  context.latestBlockHeight.toNumber()
                              ) > 1000
                            ? "text-danger"
                            : Math.abs(
                                node.lastHeight -
                                  context.latestBlockHeight.toNumber()
                              ) > 50
                            ? "text-warning"
                            : ""
                        } online-nodes-text`}
                        md={3}
                      >
                        {` ${node.lastHeight}`}
                      </Col>
                    )}
                  </Row>
                </Col>

                <Col xs="3" className="online-nodes-content-cell">
                  <Row noGutters>
                    <Col className="online-nodes-details-title">
                      <Term
                        title={"Latest Telemetry Update"}
                        text={"Latest Telemetry Update explain text"}
                      />
                    </Col>
                  </Row>
                  <Row noGutters>
                    <Col className="online-nodes-text">
                      {node?.lastSeen ? <Timer time={node.lastSeen} /> : "..."}
                    </Col>
                  </Row>
                </Col>

                <Col xs="3" className="online-nodes-content-cell">
                  <Row noGutters>
                    <Col className="online-nodes-details-title">
                      <Term
                        title={"Node Agent Name"}
                        text={"Node Agent Name explain text"}
                      />
                    </Col>
                  </Row>
                  <Row noGutters>
                    <Col>
                      {node ? (
                        <Badge variant="secondary" className="agent-name-badge">
                          {node.agentName}
                        </Badge>
                      ) : (
                        "..."
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col xs="3" className="online-nodes-content-cell">
                  <Row noGutters>
                    <Col className="online-nodes-details-title">
                      <Term
                        title={"Node Agent Version / Build"}
                        text={"Node Agent Version / Build explain text"}
                      />
                    </Col>
                  </Row>
                  <Row noGutters>
                    <Col>
                      {node ? (
                        <Badge variant="secondary" className="agent-name-badge">
                          {" "}
                          v{node.agentVersion} / {node.agentBuild}
                        </Badge>
                      ) : (
                        "..."
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </td>
          </TableCollapseRow>
          <style global jsx>{`
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap");

            .online-nodes-text {
              font-weight: 500;
              font-size: 14px;
              color: #3f4045;
            }

            .online-node-label {
              margin-right: 24px;
              flex: 0 0 auto;
              width: 55px;
            }

            .online-nodes-content-row {
              padding-top: 16px;
              padding-bottom: 16px;
            }
            .online-nodes-content-row > .online-nodes-content-cell {
              padding: 0 22px;
              border-right: 1px solid #e5e5e6;
            }

            .online-nodes-content-row > .online-nodes-content-cell:last-child {
              border-right: none;
            }

            .online-nodes-details-title {
              display: flex;
              flex-wrap: nowrap;
              font-size: 12px;
              color: #a2a2a8;
            }

            .agent-name-badge {
              background-color: #f0f0f1;
              color: #72727a;
              font-weight: 500;
              font-size: 12px;
              font-family: "Roboto Mono", monospace;
            }

            .node-status {
              font-size: 12px;
              line-height: 18px;
              color: #4a4f54;
            }
          `}</style>
        </>
      )}
    </DatabaseConsumer>
  );
};

export default NodeRow;
