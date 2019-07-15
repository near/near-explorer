import { Row, Col } from "react-bootstrap";

const Search = props => (
  <div className="search">
    <Row noGutters="true">
      <Col md="1" xs="2" className="align-self-center">
        <img src="/static/images/icon-search.svg" className="search-icon" />
      </Col>
      <Col md="11" xs="10" className="align-self-center">
        <div className="d-none d-sm-block">
          <input
            type="text"
            className="search-text"
            placeholder={props.text}
            onChange={props.handler}
          />
        </div>
        <div className="d-block d-sm-none">
          <input
            type="text"
            className="search-text"
            placeholder={`${props.text.substring(0, 17)}..`}
            title={props.text}
            onChange={props.handler}
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

export default Search;
