import * as React from "react";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";

import BlocksRow from "./BlocksRow";
import { BlockBase } from "../../types/common";

const BLOCKS_PER_PAGE = 15;

export interface Props {
  items: BlockBase[];
}

const Blocks: React.FC<Props> = React.memo(({ items }) => (
  <FlipMove duration={1000} staggerDurationBy={0}>
    {items.map((block) => (
      <div key={block.hash}>
        <BlocksRow block={block} />
      </div>
    ))}
  </FlipMove>
));

const BlocksList = ListHandler<BlockBase, number>({
  Component: Blocks,
  key: ["Block", "total-list"],
  hasUpdateButton: true,
  paginationIndexer: (lastPage) => {
    const lastElement = lastPage[lastPage.length - 1];
    if (!lastElement) {
      return;
    }
    return lastElement.timestamp;
  },
  fetch: (fetcher, paginationIndexer) =>
    fetcher("blocks-list", [BLOCKS_PER_PAGE, paginationIndexer ?? null]),
});

export default BlocksList;
