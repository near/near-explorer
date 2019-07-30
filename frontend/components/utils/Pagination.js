import { useEffect, useState, useContext } from "react";

import { Row, Col, Spinner } from "react-bootstrap";

import EmptyRow from "./EmptyRow";
import { DataConsumer, DataContext } from "./DataProvider";

const Pagination = ({ checkForNew }) => {
  const [newPagination, setNewPagination] = useState(null);

  const ctx = useContext(DataContext);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      console.log("Checking for new results");
      const newResults = await checkForNew();

      if (newResults && newResults > 0) {
        console.log("Found new results!", newResults);
        setNewPagination(newResults);

        ctx.setPagination(pagination => {
          return { ...pagination, headerHidden: false };
        });
      }
    }, 10000);

    return () => {
      clearInterval(intervalID);
    };
  }, [ctx.pagination]);

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
                      {newPagination}. Refresh or{" "}
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

const PaginationSpinner = ({ hidden }) => (
  <div style={{ display: hidden ? "none" : "default" }}>
    <EmptyRow />
    <Row>
      <Col md="auto" className="mx-auto">
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
      </Col>
    </Row>
  </div>
);

export default Pagination;
export { PaginationSpinner };
