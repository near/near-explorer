import { FC } from "react";
import { Row, Col, Spinner } from "react-bootstrap";

interface Props {
  hidden?: boolean;
}

const PaginationSpinner: FC<Props> = ({ hidden }) => (
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
