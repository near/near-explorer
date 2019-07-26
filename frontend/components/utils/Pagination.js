import { useState, useEffect, useContext } from "react";

import { Row, Col } from "react-bootstrap";

import EmptyRow from "./EmptyRow";
import { DataContext } from "./DataProvider";

const Footer = props => {
  const [hidden, setHidden] = useState(false);

  const ctx = useContext(DataContext);

  useEffect(() => {
    setHidden(false);
  }, [ctx.pagination.new]);

  return (
    <div style={{ display: hidden ? "none" : "default" }}>
      <EmptyRow />
      <Row>
        <Col className="pagination-header">
          <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
            <Col md="auto">&nbsp;</Col>
            <Col md="auto">
              <span className="pagination-content">
                {ctx.pagination.new} new blocks. Refresh or{" "}
              </span>
              <span className="pagination-content-link">
                click here to view.
              </span>
            </Col>
            <Col md="auto" className="ml-auto">
              <span
                className="pagination-close"
                onClick={() => setHidden(true)}
              >
                Ignore this
              </span>
            </Col>
            <Col md="auto">&nbsp;</Col>
          </Row>
        </Col>
      </Row>
      <style jsx global>{`
        .pagination-header {
          background-color: rgba(106, 209, 227, 0.15);
          background-clip: content-box;
        }

        .pagination-content,
        .pagination-content-link,
        .pagination-close {
          font-size: 14px;
          font-weight: bold;
          line-height: 2.29;
          color: #6ad1e3;
        }

        .pagination-content-link {
          cursor: pointer;
          text-decoration: underline;
        }

        .pagination-close {
          color: #999999 !important;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Footer;
