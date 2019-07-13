import Link from "next/link";

import { Row, Col } from "react-bootstrap";

const PageDisplaySelect = props => (
  <Col
    md="auto"
    xs="3"
    className="align-self-center transactions-filter-by-type-border"
  >
    <Row>
      <Col md="auto" className="align-self-center pr-0">
        <div className="transactions-filter-by-type">
          <span>{props.rowCount}</span>
          <img src="/static/images/icon-arrow-down.svg" />
        </div>
      </Col>
      <Col className="align-self-center text-right d-none d-sm-block">
        <span className="transactions-filter-by-type-text">Per Page</span>
      </Col>
    </Row>
  </Col>
);

const TransactionsFooter = props => (
  <Row>
    <PageDisplaySelect rowCount="10" />
    <Col md="auto" xs="3" className="align-self-center">
      <span className="search-header-start">
        {props.start}-{props.stop}
      </span>
      <span className="search-header-total"> of {props.total} Total</span>
    </Col>
  </Row>
);

export default TransactionsFooter;
