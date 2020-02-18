import { Row, Col } from "react-bootstrap";

import BlocksApi from "../../libraries/explorer-wamp/blocks";

import Search from "../utils/Search";

export default ({ setLoading, setBlocks, pagination, setPagination }) => {
  const search = async text => {
    setLoading(true);

    let blocks;
    if (text === null || text === undefined || text.trim().length === 0) {
      blocks = await new BlocksApi().getBlocks();
    } else {
      blocks = await new BlocksApi().searchBlocks(text);
    }

    setBlocks(() => blocks);

    if (blocks.length > 0) {
      setPagination(pagination => {
        return {
          ...pagination,
          start: blocks[0].height,
          stop: blocks[blocks.length - 1].height
        };
      });
    }

    setLoading(false);
  };

  return (
    <Row>
      <Col md="auto" className="align-self-center pagination-total">
        {pagination.total && `${pagination.total.toLocaleString()} Total`}
      </Col>
      <Col md="5" xs="6" className="ml-auto align-self-center">
        <Search
          text="Search blocks..."
          handler={search}
          pagination={pagination}
          setPagination={setPagination}
        />
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
