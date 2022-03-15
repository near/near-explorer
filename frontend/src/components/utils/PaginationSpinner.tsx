import * as React from "react";
import { Row, Col, Spinner } from "react-bootstrap";

const PaginationSpinner: React.FC = React.memo(() => (
  <div>
    <Row>
      <Col xs="auto" className="mx-auto">
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
      </Col>
    </Row>
  </div>
));

export default PaginationSpinner;
