import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Search from "../utils/Search";

export default props => (
  <Row>
    <TransactionsFilterByType />
    <DataConsumer>
      {ctx => (
        <Col md="auto" xs="3" className="align-self-center">
          <span className="search-header-start">
            {ctx.pagination.start}-{ctx.pagination.stop}
          </span>
          <span className="search-header-total">
            {" "}
            of {ctx.pagination.total} Total
          </span>
        </Col>
      )}
    </DataConsumer>
    <Col md="4" xs="6" className="ml-auto align-self-center">
      <Search text="Search transactions and receipts..." />
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
