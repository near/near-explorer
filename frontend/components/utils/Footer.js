import { useState, useEffect } from "react";

import { Row, Col } from "react-bootstrap";

const Footer = props => {
  const [count, setCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // TODO: call the api to get the information requested.
    // props.type => block, transaction, or contract
  }, [count, currentPage]);

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
              <div className="select-row-count">
                <span>{count}</span>
                <img src="/static/images/icon-arrow-down.svg" />
              </div>
            </Col>
            <Col className="align-self-center text-right d-none d-sm-block">
              <span className="select-row-count-text">Per Page</span>
            </Col>
          </Row>
        </Col>
        <Col md="auto" xs="3" className="align-self-center">
          <span className="search-header-start">
            {props.start}-{props.stop}
          </span>
          <span className="search-header-total"> of {props.total} Total</span>
        </Col>
      </Row>
      <style jsx global>{`
        .filter-by-type-border {
          border-right: 2px solid #f8f8f8;
          cursor: pointer;
        }

        .select-row-count {
          border-radius: 25px;
          border: solid 2px #e6e6e6;
          padding: 4px 14px;
          color: #999999;
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
      `}</style>
    </Col>
  );
};

export default Footer;
