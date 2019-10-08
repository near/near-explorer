import { Row, Col, Spinner } from "react-bootstrap";

import EmptyRow from "./EmptyRow";

export default ({ hidden }) => (
  <div style={{ display: hidden ? "none" : "default" }}>
    <EmptyRow />
    <Row>
      <Col md="auto" className="mx-auto">
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
      </Col>
    </Row>
  </div>
);
