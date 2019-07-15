import { useState, useEffect } from "react";

import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";

import { DataConsumer } from "./DataProvider";

const Footer = props => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // TODO: call the api to get the information requested.
    // props.type => block, transaction, or contract
  }, [currentPage]);

  const onSelect = (count, ctx) => {
    let stop = parseInt(count) + ctx.pagination.start - 1;
    if (!isNaN(ctx.pagination.total) && stop > ctx.pagination.total) {
      stop = ctx.pagination.total;
    }

    ctx.setPagination({ ...ctx.pagination, count: count, stop: stop });
  };

  return (
    <Col>
      <Row>
        <Col
          md="auto"
          xs="3"
          className="align-self-center filter-by-type-border"
        >
          <Row>
            <Col md="auto" className="align-self-center pr-0">
              <DataConsumer>
                {ctx => (
                  <Dropdown onSelect={value => onSelect(value, ctx)}>
                    <Dropdown.Toggle className="select-row-count">
                      {ctx.pagination.count}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {[10, 25, 50, 100].map(value =>
                        value != ctx.pagination.count ? (
                          <Dropdown.Item key={value} eventKey={value}>
                            {value}
                          </Dropdown.Item>
                        ) : null
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </DataConsumer>
            </Col>
            <Col className="align-self-center text-right d-none d-sm-block">
              <span className="select-row-count-text">Per Page</span>
            </Col>
          </Row>
        </Col>
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
      </Row>
      <style jsx global>{`
        .filter-by-type-border {
          border-right: 2px solid #f8f8f8;
        }

        .select-row-count,
        .select-row-count:hover,
        .select-row-count:focus {
          border-radius: 25px;
          border: solid 2px #e6e6e6;
          padding: 4px 14px;
          color: #999999 !important;
          cursor: pointer;
          background: transparent !important;
          box-shadow: none;
        }

        .select-row-count img {
          width: 14px;
          margin-left: 8px;
        }

        .select-row-count-text {
          font-family: BentonSans;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.4px;
          color: #999999;
          text-transform: uppercase;
        }

        .search-header-start {
          font-family: BentonSans;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.4px;
        }

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
};

export default Footer;
