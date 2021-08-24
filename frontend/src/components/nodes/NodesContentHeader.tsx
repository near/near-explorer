import { PureComponent } from "react";
import { Col, Row } from "react-bootstrap";

import NodeNav from "./NodeNav";

import { Translate } from "react-localize-redux";

interface Props {
  navRole: string;
}

const NodesIcon = () => (
  <img
    src="/static/images/icon-nodes.svg"
    style={{ width: "24px", height: "100%", marginRight: "11px" }}
  />
);

class NodesContentHeader extends PureComponent<Props> {
  render() {
    return (
      <Translate>
        {({ translate }) => (
          <Row noGutters>
            <Col xs="auto" className="content-icon-col">
              <NodesIcon />
            </Col>
            <Col className="content-title">
              <h1 style={{ fontSize: "31px", marginBottom: "0px" }}>
                {translate("component.nodes.NodesContentHeader.nodes")}
              </h1>
            </Col>
            <Col xs="12" style={{ visibility: "hidden" }}>
              <NodeNav role={this.props.navRole} />
            </Col>
          </Row>
        )}
      </Translate>
    );
  }
}

export default NodesContentHeader;
