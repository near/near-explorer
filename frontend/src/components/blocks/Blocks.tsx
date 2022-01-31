import { FC } from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";

import BlocksRow from "./BlocksRow";
import { WampCall } from "../../libraries/wamp/api";
import { BlockBase } from "../../libraries/wamp/types";

const BLOCKS_PER_PAGE = 15;

const fetchDataFn = (
  wampCall: WampCall,
  count: number,
  paginationIndexer?: number
) => wampCall("blocks-list", [count, paginationIndexer]);

const BlocksWrapper: FC = () => (
  <BlocksList count={BLOCKS_PER_PAGE} fetchDataFn={fetchDataFn} />
);

export default BlocksWrapper;

export interface InnerProps {
  items: BlockBase[];
}

const Blocks: FC<InnerProps> = ({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items.map((block) => (
      <div key={block.hash}>
        <BlocksRow block={block} />
      </div>
    ))}
  </FlipMove>
);

const BlocksList = ListHandler({
  Component: Blocks,
  category: "Block",
  hasUpdateButton: true,
  paginationIndexer: (items) => items[items.length - 1].timestamp,
});
