import { useEffect, useContext } from "react";

import { Row, Col } from "react-bootstrap";

import EmptyRow from "./EmptyRow";
import { DataContext, DataConsumer } from "./DataProvider";

const Footer = props => {
  useEffect(() => {
    const ele = document.getElementById(props.elementId);
    const isAtBottom = () => {
      return ele.getBoundingClientRect().bottom <= window.innerHeight;
    };
    const onScroll = async () => {
      if (isAtBottom()) {
        document.removeEventListener("scroll", onScroll);

        // load the next set.
        await props.getNextBatch();

        // Add the listener again.
        document.addEventListener("scroll", onScroll);
      }
    };
    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [props.getNextBatch]);

  return (
    <div>
      <DataConsumer>
        {ctx => (
          <div
            style={{
              display: ctx.pagination.headerHidden ? "none" : "default"
            }}
          >
            <EmptyRow />
            <Row>
              <Col className="pagination-header">
                <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                  <Col md="auto">&nbsp;</Col>
                  <Col md="auto">
                    <span className="pagination-content">
                      {ctx.pagination.newBlocks} new blocks. Refresh or{" "}
                    </span>
                    <span className="pagination-content-link">
                      click here to view.
                    </span>
                  </Col>
                  <Col md="auto" className="ml-auto">
                    <span
                      className="pagination-close"
                      onClick={() =>
                        ctx.setPagination(pagination => {
                          return { ...pagination, headerHidden: true };
                        })
                      }
                    >
                      Ignore this
                    </span>
                  </Col>
                  <Col md="auto">&nbsp;</Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </DataConsumer>
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
