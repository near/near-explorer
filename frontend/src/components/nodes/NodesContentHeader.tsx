import * as React from "react";

import { useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import NodeNav from "@explorer/frontend/components/nodes/NodeNav";
import { styled } from "@explorer/frontend/libraries/styles";

const NodesContentHeaderWrapper = styled("h1", {
  fontSize: 31,
  marginBottom: 0,
});

const NodesIcon = styled("img", {
  width: 24,
  height: "100%",
  marginRight: 11,
});

const NodesContentHeader: React.FC = React.memo(() => {
  const { t } = useTranslation();
  return (
    <Row noGutters>
      <Col xs="auto">
        <NodesIcon src="/static/images/icon-nodes.svg" />
      </Col>
      <Col>
        <NodesContentHeaderWrapper>
          {t("component.nodes.NodesContentHeader.nodes")}
        </NodesContentHeaderWrapper>
      </Col>
      <Col xs="12" style={{ visibility: "hidden" }}>
        <NodeNav />
      </Col>
    </Row>
  );
});

export default NodesContentHeader;
