import { useState } from "react";

import { Row, Col } from "react-bootstrap";

export default ({ text, handler, pagination, setPagination }) => {
  const [focus, setFocus] = useState(false);

  const onChange = (state) => {
    setPagination((pagination) => {
      return {
        ...pagination,
        search: state,
      };
    });

    if (state === null || state === undefined || state.trim().length === 0) {
      setFocus(false);
      handler(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const keyword = pagination.search;
    if (
      keyword === null ||
      keyword === undefined ||
      keyword.trim().length === 0
    ) {
      return;
    }

    setFocus(false);
    handler(keyword);
  };

  const onMouseLeave = () => {
    setFocus(false);
    document.getElementById("search-text").blur();
  };

  return (
    <Row>
      <Col
        md={focus ? "12" : "9"}
        className="ml-auto search"
        onFocus={() => setFocus(true)}
        onMouseLeave={onMouseLeave}
      >
        <Row>
          <Col
            md={focus ? "7" : "10"}
            xs="10"
            className="align-self-center text-left"
          >
            <div className="d-none d-sm-block">
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  id="search-text"
                  className="search-text"
                  value={pagination.search ? pagination.search : ""}
                  placeholder={text}
                  onChange={(e) => onChange(e.target.value)}
                />
              </form>
            </div>
            <div className="d-block d-sm-none">
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  className="search-text"
                  placeholder={`${text.substring(0, 17)}..`}
                  title={text}
                  onChange={(e) => handler(e.target.value)}
                />
              </form>
            </div>
          </Col>
          <Col
            md="auto"
            xs="2"
            id="search-icon-border"
            className={`align-self-center ml-auto ${
              focus ? "search-icon-border text-center" : "text-center"
            }`}
          >
            {focus ? (
              <span
                style={{ color: "#999999", fontWeight: "bold" }}
                onClick={onSubmit}
              >
                Search
              </span>
            ) : (
              <img
                src="/static/images/icon-search.svg"
                className="search-icon"
              />
            )}
          </Col>
        </Row>
      </Col>
      <style jsx global>{`
        .search-box {
          background: white;
          width: ${this.props.dashboard ? "740px" : "500px"};
          max-width: 100%;
          height: ${this.props.dashboard ? "49px" : "40px"};
          margin: auto;
        }

        @media (max-width: 1000px) {
          .search-box {
            width: 100%;
          }
        }

        .input-group-text {
          background: #fafafa;
          border: 2px solid #eaebeb;
          border-right: none;
        }

        .search-field {
          background: ${this.props.dashboard ? "#FFFFFF" : "#FAFAFA"};
          border: 2px solid #eaebeb;
          border-left: ${this.props.dashboard ? "inherit" : "none"};
          box-sizing: border-box;
          border-radius: 8px;
          height: 100%;
          font-weight: lighter;
        }

        .search-text::placeholder {
          color: #999999;
          opacity: 1; /* Firefox */
        }
      `}</style>
    </Row>
  );
};
