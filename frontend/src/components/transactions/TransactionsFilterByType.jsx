import { Row, Col } from "react-bootstrap";

const TransactionFilter = () => (
  <Col
    md="auto"
    xs="3"
    className="align-self-center transactions-filter-by-type-border"
  >
    <Row>
      <Col md="auto" className="align-self-center pr-0">
        <div className="transactions-filter-by-type">
          <img src="/static/images/icon-m-filter.svg" />
          <img src="/static/images/icon-arrow-down.svg" />
        </div>
      </Col>
      <Col className="align-self-center text-right d-none d-sm-block">
        <span className="transactions-filter-by-type-text">Filter by type</span>
      </Col>
    </Row>
    <style jsx global>{`
      .transactions-filter-by-type-border {
        border-right: 2px solid #f8f8f8;
        cursor: pointer;
      }

      .transactions-filter-by-type {
        border-radius: 25px;
        border: solid 2px #e6e6e6;
        padding: 4px 14px;
        color: #999999;
      }

      .transactions-filter-by-type img {
        width: 14px;
        margin-left: 8px;
      }
    `}</style>
  </Col>
);

export default TransactionFilter;
