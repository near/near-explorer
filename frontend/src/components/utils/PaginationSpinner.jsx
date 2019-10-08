import { Row, Col, Spinner } from "react-bootstrap";

export default ({ hidden }) => (
  <div style={{ display: hidden ? "none" : "default" }}>
    <Row>
      <Col md="auto" className="mx-auto">
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
      </Col>
    </Row>
  </div>
);
