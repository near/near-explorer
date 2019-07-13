import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "./utils/DataProvider";

import Content from "./Content";
import BlocksHeader from "./blocks/BlocksHeader";
import BlocksRow from "./blocks/BlocksRow";
import BlocksFooter from "./blocks/BlocksFooter";
import EmptyRow from "./utils/EmptyRow";

const Blocks = () => (
  <Content title="Blocks" count="123456">
    <BlocksHeader start="1" stop="10" total="254" />
    <EmptyRow />
    <DataConsumer>
      {context =>
        context.blocks.map((block, index) => (
          <BlocksRow
            key={block.hash}
            txn={block}
            cls={`${
              context.blocks.length - 1 === index
                ? "transaction-row-bottom"
                : ""
            }`}
          />
        ))
      }
    </DataConsumer>
    <EmptyRow />
    <BlocksFooter start="1" stop="10" total="254" />
    <EmptyRow rows="5" />
  </Content>
);

export default Blocks;
