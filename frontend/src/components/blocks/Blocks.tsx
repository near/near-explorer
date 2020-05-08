import React from "react";

import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import FlipMove from "../utils/FlipMove";
import BlocksRow from "./BlocksRow";

import { OuterProps } from "../accounts/Accounts";

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15,
  };

  fetchBlocks = async (count: number, paginationIndexer?: number) => {
    return await new BlocksApi().getBlocks(count, paginationIndexer);
  };

  config = {
    fetchDataFn: this.fetchBlocks,
    count: this.props.count,
    category: "Block",
  };

  autoRefreshBlocks = autoRefreshHandler(Blocks, this.config);

  render() {
    return <this.autoRefreshBlocks />;
  }
}

export interface InnerProps extends OuterProps {
  items: B.BlockInfo[];
}

class Blocks extends React.Component<InnerProps> {
  render() {
    const { items } = this.props;
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {items &&
          items.map((block) => <BlocksRow key={block.hash} block={block} />)}
      </FlipMove>
    );
  }
}
