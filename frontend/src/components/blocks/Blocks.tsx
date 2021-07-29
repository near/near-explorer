import { Component } from "react";

import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";

import BlocksRow from "./BlocksRow";

import { OuterProps } from "../accounts/Accounts";

class BlocksWrapper extends Component<OuterProps> {
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

  BlocksList = ListHandler(Blocks, this.config);

  render() {
    return <this.BlocksList />;
  }
}

export default BlocksWrapper;

export interface InnerProps extends OuterProps {
  items: B.BlockInfo[];
}

class Blocks extends Component<InnerProps> {
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
