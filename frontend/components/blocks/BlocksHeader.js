import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Search from "../utils/Search";

import BlocksPageDisplaySelect from "./BlocksPageDisplaySelect";

const BlocksFilterByType = () => (
  <Col
    md="auto"
    xs="3"
    className="align-self-center transactions-filter-by-type-border"
  >
    <Row>
      <BlocksPageDisplaySelect rowCount="10" />
    </Row>
    <style jsx global>{`
      .transactions-filter-by-type-border {
        border-right: 2px solid #f8f8f8;
        cursor: pointer;
      }
    `}</style>
  </Col>
);

const BlocksHeader = props => (
  <Row>
    <BlocksFilterByType />
    <Col md="auto" xs="3" className="align-self-center">
      <span className="search-header-start">
        {props.start}-{props.stop}
      </span>
      <span className="search-header-total"> of {props.total} Total</span>
    </Col>
    <Col md="4" xs="6" className="ml-auto align-self-center">
      <Search text="Search blocks..." />
    </Col>
    <style jsx global>{`
      .search-header-start {
        font-family: BentonSans;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 1.4px;
      }

      .transactions-filter-by-type-text,
      .search-header-total {
        font-family: BentonSans;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 1.4px;
        color: #999999;
        text-transform: uppercase;
      }
    `}</style>
  </Row>
);

export default BlocksHeader;
