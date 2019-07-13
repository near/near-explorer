import { Row, Col } from "react-bootstrap";

const BlocksPageDisplaySelect = props => (
  <Col
    md="auto"
    xs="3"
    className="align-self-center blocks-filter-by-type-border"
  >
    <Row>
      <Col md="auto" className="align-self-center pr-0">
        <div className="blocks-filter-by-type">
          <span>{props.rowCount}</span>
          <img src="/static/images/icon-arrow-down.svg" />
        </div>
      </Col>
      <Col className="align-self-center text-right d-none d-sm-block">
        <span className="blocks-filter-by-type-text">Per Page</span>
      </Col>
    </Row>
    <style jsx global>{`
      .blocks-filter-by-type-border {
        border-right: 2px solid #f8f8f8;
        cursor: pointer;
      }

      .blocks-filter-by-type {
        border-radius: 25px;
        border: solid 2px #e6e6e6;
        padding: 4px 14px;
        color: #999999;
      }

      .blocks-filter-by-type img {
        width: 14px;
        margin-left: 8px;
      }

      .blocks-filter-by-type-text,
      .search-header-total {
        font-family: BentonSans;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 1.4px;
        color: #999999;
        text-transform: uppercase;
      }
    `}</style>
  </Col>
);

export default BlocksPageDisplaySelect;
