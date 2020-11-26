import { Row, Col } from "react-bootstrap";

import Search from "../utils/Search";

export default (props) => (
  <Row>
    <TransactionsFilterByType />
    <Col md="4" xs="6" className="ml-auto align-self-center">
      <Search text="Search transactions and receipts..." />
    </Col>
    <style jsx global>{`
      .search-header-start {
        font-family: "Inter", sans-serif;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 1.4px;
      }

      .transactions-filter-by-type-text,
      .search-header-total {
        font-family: "Inter", sans-serif;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 1.4px;
        color: #999999;
        text-transform: uppercase;
      }
    `}</style>
  </Row>
);
