import Link from "next/link";

import { useEffect } from "react";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "./utils/DataProvider";

import Content from "./Content";
import BlocksPaginationHeader from "./blocks/BlocksPaginationHeader";
import BlocksRow from "./blocks/BlocksRow";
import BlocksPaginationFooter from "./blocks/BlocksPaginationFooter";
import EmptyRow from "./utils/EmptyRow";

const Blocks = () => {
  useEffect(() => {
    // TODO: update the pagination for blocks.
  }, []);

  return (
    <DataConsumer>
      {ctx => (
        <Content title="Blocks" count={ctx.pagination.total}>
          <BlocksPaginationHeader />
          <EmptyRow />
          {ctx.blocks.map((block, index) => (
            <BlocksRow
              key={block.hash}
              block={block}
              cls={`${
                ctx.blocks.length - 1 === index ? "transaction-row-bottom" : ""
              }`}
            />
          ))}
          <EmptyRow rows="5" />
        </Content>
      )}
    </DataConsumer>
  );
};

export default Blocks;
