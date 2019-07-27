import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Search from "../utils/Search";

import BlocksApi from "../api/Blocks";

const BlocksHeader = props => {
  const search = async text => {
    const blocks = await BlocksApi.searchBlocks(text);
    console.log(blocks);
  };

  return (
    <Row>
      <Col md="auto" className="align-self-center pagination-total">
        <DataConsumer>
          {ctx =>
            ctx.pagination.total ? ctx.pagination.total.toLocaleString() : 0
          }
        </DataConsumer>
        &nbsp;Total
      </Col>
      <Col md="4" xs="6" className="ml-auto align-self-center">
        <Search text="Search blocks..." handler={search} />
      </Col>
      <style jsx global>{`
        .pagination-total {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.38px;
          color: #999999;
          text-transform: uppercase;
        }
      `}</style>
    </Row>
  );
};

export default BlocksHeader;
