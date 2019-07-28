import { useState } from "react";

import { Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import BlocksApi from "./api/Blocks";

import Content from "./Content";
import BlocksHeader from "./blocks/BlocksHeader";
import BlocksRow from "./blocks/BlocksRow";

import { DataContext, DataConsumer } from "./utils/DataProvider";
import EmptyRow from "./utils/EmptyRow";
import Pagination, { PaginationSpinner } from "./utils/Pagination";

const Blocks = () => {
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      let blocks = [];
      if (ctx.pagination.search) {
        blocks = await BlocksApi.searchBlocks(
          ctx.pagination.search,
          ctx.pagination.stop
        );
      } else {
        blocks = await BlocksApi.getPreviousBlocks(
          ctx.pagination.stop,
          ctx.pagination.count
        );
      }

      if (blocks.length === 0) {
        return;
      }

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

    setLoading(false);
  };

  return (
    <DataConsumer>
      {ctx => (
        <Content title="Blocks">
          <BlocksHeader setLoading={setLoading} />
          <Pagination
            elementId="blocks-pagination-content"
            getNextBatch={() => getNextBatch(ctx)}
          />
          <EmptyRow />
          <LoadingOverlay active={loading} spinner text="Loading blocks...">
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
          </LoadingOverlay>
          <PaginationSpinner hidden={false} />
          <EmptyRow rows="5" />
        </Content>
      )}
    </DataConsumer>
  );
};

export default Blocks;
