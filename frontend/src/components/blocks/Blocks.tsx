import { FC } from "react";

import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";

import BlocksRow from "./BlocksRow";

const BLOCKS_PER_PAGE = 15;

const fetchDataFn = (count: number, paginationIndexer?: number) =>
  new BlocksApi().getBlocks(count, paginationIndexer);

const BlocksWrapper: FC = () => (
  <BlocksList count={BLOCKS_PER_PAGE} fetchDataFn={fetchDataFn} />
);

export default BlocksWrapper;

export interface InnerProps {
  items: B.Block[];
}

const Blocks: FC<InnerProps> = ({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items &&
      items.map((block) => (
        <div key={block.hash}>
          <BlocksRow block={block} />
        </div>
      ))}
  </FlipMove>
);

const BlocksList = ListHandler({
  Component: Blocks,
  category: "Block",
  paginationIndexer: (items) => items[items.length - 1].timestamp,
});
