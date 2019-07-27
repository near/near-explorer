import { useState, useContext } from "react";

import { Row, Col } from "react-bootstrap";

import { DataContext } from "./DataProvider";

const Search = ({ text, handler }) => {
  const ctx = useContext(DataContext);

  const onChange = state => {
    ctx.setPagination(pagination => {
      return {
        ...pagination,
        search: state
      };
    });

    if (state === null || state === undefined || state.trim().length === 0) {
      handler(null);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    handler(ctx.pagination.search);
  };

  return (
    <div className="search">
      <Row noGutters="true">
        <Col md="1" xs="2" className="align-self-center">
          <img src="/static/images/icon-search.svg" className="search-icon" />
        </Col>
        <Col md="11" xs="10" className="align-self-center">
          <div className="d-none d-sm-block">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                className="search-text"
                value={ctx.pagination.search ? ctx.pagination.search : ""}
                placeholder={text}
                onChange={e => onChange(e.target.value)}
              />
            </form>
          </div>
          <div className="d-block d-sm-none">
            <input
              type="text"
              className="search-text"
              placeholder={`${text.substring(0, 17)}..`}
              title={text}
              onInput={e => handler(e.target.value)}
            />
          </div>
        </Col>
      </Row>
      <style jsx global>{`
        .search {
          border-radius: 25px;
          border: solid 2px #e6e6e6;
          background-color: #f8f8f8;
          padding: 4px 14px;
        }

        .search-icon {
          width: 14px;
        }

        .search-text {
          font-family: BentonSans;
          font-size: 14px;
          color: #999999;
          outline: none;
          border: 0;
          background-color: #f8f8f8;
          width: 100%;
          font-weight: 100;
        }

        .search-text::placeholder {
          color: #999999;
          opacity: 1; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Search;
