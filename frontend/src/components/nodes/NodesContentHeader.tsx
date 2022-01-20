import { FC } from "react";
import { Col, Row } from "react-bootstrap";

import NodeNav from "./NodeNav";

import { useTranslation } from "react-i18next";

interface Props {
  navRole: string;
}

const NodesIcon = () => (
  <img
    src="/static/images/icon-nodes.svg"
    style={{ width: "24px", height: "100%", marginRight: "11px" }}
  />
);

const NodesContentHeader: FC<Props> = ({ navRole }) => {
  const { t } = useTranslation();
  return (
    <Row noGutters>
      <Col xs="auto" className="content-icon-col">
        <NodesIcon />
      </Col>
      <Col className="content-title">
        <h1 style={{ fontSize: "31px", marginBottom: "0px" }}>
          {t("component.nodes.NodesContentHeader.nodes")}
        </h1>
      </Col>
      <Col xs="12" style={{ visibility: "hidden" }}>
        <NodeNav role={navRole} />
      </Col>
    </Row>
  );
};

export default NodesContentHeader;
