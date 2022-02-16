import { FC } from "react";
import { Col, Row } from "react-bootstrap";

import NodeNav from "./NodeNav";

import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

const NodesContentHeaderWrapper = styled("h1", {
  fontSize: 31,
  marginBottom: 0,
});

const NodesIcon = styled("img", {
  width: 24,
  height: "100%",
  marginRight: 11,
});

interface Props {
  navRole: string;
}

const NodesContentHeader: FC<Props> = ({ navRole }) => {
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
        <NodeNav role={navRole} />
      </Col>
    </Row>
  );
};

export default NodesContentHeader;
