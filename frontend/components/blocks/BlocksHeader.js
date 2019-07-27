import { useContext } from "react";

import { Row, Col } from "react-bootstrap";

import { DataConsumer, DataContext } from "../utils/DataProvider";
import Search from "../utils/Search";

import BlocksApi from "../api/Blocks";

const BlocksHeader = props => {
  const ctx = useContext(DataContext);

  const search = async text => {
    let blocks;
    if (text === null || text === undefined || text.trim().length === 0) {
      blocks = await BlocksApi.getLatestBlocksInfo();
    } else {
      blocks = await BlocksApi.searchBlocks(text);
    }

    ctx.setBlocks(blocks);

    if (blocks.length > 0) {
      ctx.setPagination(pagination => {
        return {
          ...pagination,
          start: blocks[0].height,
          stop: blocks[blocks.length - 1].height
        };
      });
    }
  };

  return (
    <Row>
      <Col md="auto" className="align-self-center pagination-total">
        {ctx.pagination.total ? ctx.pagination.total.toLocaleString() : 0}
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
