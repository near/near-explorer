import Link from "next/link";

import { useEffect, useContext } from "react";

import { Row, Col } from "react-bootstrap";

import BlocksApi from "./api/Blocks";

import { DataContext } from "./utils/DataProvider";

import Content from "./Content";
import BlocksPaginationHeader from "./blocks/BlocksPaginationHeader";
import BlocksRow from "./blocks/BlocksRow";
import BlocksPaginationFooter from "./blocks/BlocksPaginationFooter";

import EmptyRow from "./utils/EmptyRow";
import Pagination from "./utils/Pagination";

const Blocks = () => {
  const ctx = useContext(DataContext);

  const constructBlock = (block, index, length) => {
    return (
      <BlocksRow
        key={block.hash}
        block={block}
        cls={`${length - 1 === index ? "transaction-row-bottom" : ""}`}
      />
    );
  };

  const getNextBatch = async () => {
    console.log(ctx.pagination);
    try {
      const blocks = await BlocksApi.getPreviousBlocks(
        ctx.pagination.stop,
        ctx.pagination.count
      );

      ctx.setBlocks(blocks_ => {
        blocks_.push(...blocks);
        return _blocks;
      });
      ctx.setPagination(pagination => {
        return { ...pagination, stop: blocks[blocks.length - 1].height };
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Content title="Blocks" count={ctx.pagination.total}>
      <BlocksPaginationHeader />
      <Pagination
        elementId="blocks-pagination-content"
        getNextBatch={getNextBatch}
      />
      <EmptyRow />
      <div id="blocks-pagination-content">
        {ctx.blocks.map((block, index) => (
          <BlocksRow
            key={block.hash}
            block={block}
            cls={`${
              ctx.blocks.length - 1 === index ? "transaction-row-bottom" : ""
            }`}
          />
        ))}
      </div>
      <EmptyRow rows="5" />
    </Content>
  );
};

export default Blocks;
