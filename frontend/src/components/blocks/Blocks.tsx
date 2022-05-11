import * as React from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";

import BlocksRow from "./BlocksRow";
import { Fetcher } from "../../libraries/transport";
import { BlockBase } from "../../types/common";

const BLOCKS_PER_PAGE = 15;

const fetchDataFn = (
  fetcher: Fetcher,
  count: number,
  paginationIndexer: number | null
) => fetcher("blocks-list", [count, paginationIndexer]);

const BlocksWrapper: React.FC = React.memo(() => (
  <BlocksList count={BLOCKS_PER_PAGE} fetchDataFn={fetchDataFn} />
));

export default BlocksWrapper;

export interface InnerProps {
  items: BlockBase[];
}

const Blocks: React.FC<InnerProps> = React.memo(({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items.map((block) => (
      <div key={block.hash}>
        <BlocksRow block={block} />
      </div>
    ))}
  </FlipMove>
));

const BlocksList = ListHandler({
  Component: Blocks,
  category: "Block",
  hasUpdateButton: true,
  paginationIndexer: (items) => items[items.length - 1].timestamp,
});
