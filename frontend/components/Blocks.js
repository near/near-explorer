import { useState, useContext, useEffect } from "react";

import { Row, Col } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

import BlocksApi from "./api/Blocks";

import Content from "./Content";
import BlocksHeader from "./blocks/BlocksHeader";
import BlocksRow from "./blocks/BlocksRow";

import { DataContext, DataConsumer } from "./utils/DataProvider";
import EmptyRow from "./utils/EmptyRow";
import Pagination, { PaginationSpinner } from "./utils/Pagination";

const BlocksOverlay = ({ loading, setLoading }) => {
  const getNextBatch = async pagination => {
    setLoading(true);

    let blocks = [];
    try {
      if (pagination.search) {
        blocks = await BlocksApi.searchBlocks(
          pagination.search,
          pagination.stop
        );
      } else {
        blocks = await BlocksApi.getPreviousBlocks(
          pagination.stop,
          pagination.count
        );
      }
    } catch (err) {
      console.error("Blocks.getNextBatch failed to fetch data due to:");
      console.error(err);
    }

    setLoading(false);

    return blocks;
  };

  const ctx = useContext(DataContext);

  useEffect(() => {
    const ele = document.getElementById("block-loader");
    const isAtBottom = () => {
      return ele.getBoundingClientRect().bottom <= window.innerHeight;
    };
    const onScroll = async e => {
      e.preventDefault();

      if (isAtBottom()) {
        document.removeEventListener("scroll", onScroll);

        // load the next set.
        const blocks = await getNextBatch(ctx.pagination);
        if (blocks.length > 0) {
          ctx.setBlocks(_blocks => {
            _blocks.push(...blocks);
            return _blocks;
          });
          ctx.setPagination(pagination => {
            return { ...pagination, stop: blocks[blocks.length - 1].height };
          });
        }

        // Add the listener again.
        document.addEventListener("scroll", onScroll);
      }
    };
    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [ctx.pagination]);

  return (
    <LoadingOverlay active={loading} spinner text="Loading blocks...">
      <div id="block-loader">
        <DataConsumer>
          {ctx =>
            ctx.blocks
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
              : null
          }
        </DataConsumer>
      </div>
    </LoadingOverlay>
  );
};

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

  return (
    <Content title="Blocks">
      <BlocksHeader setLoading={setLoading} />
      <Pagination />
      <EmptyRow />
      <BlocksOverlay loading={loading} setLoading={setLoading} />
      <PaginationSpinner hidden={false} />
      <EmptyRow rows="5" />
    </Content>
  );
};

export default Blocks;
