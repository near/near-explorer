import { Row, Col, Spinner } from "react-bootstrap";

const PaginationSpinner = ({ hidden }) => (
  <div style={{ display: hidden ? "none" : "default" }}>
    <Row>
      <Col xs="auto" className="mx-auto">
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
      </Col>
    </Row>
  </div>
);

export default PaginationSpinner;
