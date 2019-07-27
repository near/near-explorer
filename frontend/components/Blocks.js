import Link from "next/link";

import { useEffect, useContext } from "react";

import { Row, Col } from "react-bootstrap";

import BlocksApi from "./api/Blocks";

import { DataContext, DataConsumer } from "./utils/DataProvider";

import Content from "./Content";
import BlocksHeader from "./blocks/BlocksHeader";
import BlocksRow from "./blocks/BlocksRow";

import EmptyRow from "./utils/EmptyRow";
import Pagination, { PaginationSpinner } from "./utils/Pagination";

const Blocks = () => {
  const constructBlock = (block, index, length) => {
    return (
      <BlocksRow
        key={block.hash}
        block={block}
        cls={`${length - 1 === index ? "transaction-row-bottom" : ""}`}
      />
    );
  };

  const getNextBatch = async ctx => {
    try {
      const blocks = await BlocksApi.getPreviousBlocks(
        ctx.pagination.stop,
        ctx.pagination.count
      );

      const stop = blocks[blocks.length - 1].height;

      ctx.setBlocks(_blocks => {
        _blocks.push(...blocks);
        return _blocks;
      });
      ctx.setPagination(pagination => {
        return { ...pagination, stop };
      });
    } catch (err) {
      console.error("Blocks.getNextBatch failed to fetch data due to:");
      console.error(err);
    }
  };

  return (
    <DataConsumer>
      {ctx => (
        <Content title="Blocks">
          <BlocksHeader />
          <Pagination
            elementId="blocks-pagination-content"
            getNextBatch={() => getNextBatch(ctx)}
          />
          <EmptyRow />
          <div id="blocks-pagination-content">
            {ctx.blocks
              ? ctx.blocks.map((block, index) => (
                  <BlocksRow
                    key={block.hash}
                    block={block}
                    cls={`${
                      ctx.blocks.length - 1 === index
                        ? "transaction-row-bottom"
                        : ""
                    }`}
                  />
                ))
              : null}
          </div>
          <PaginationSpinner hidden={false} />
          <EmptyRow rows="5" />
        </Content>
      )}
    </DataConsumer>
  );
};

export default Blocks;
