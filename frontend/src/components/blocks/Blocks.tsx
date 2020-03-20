import React from "react";

import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import PaginationSpinner from "../utils/PaginationSpinner";
import FlipMove from "../utils/FlipMove";
import BlocksList from "./BlocksList";

import { OuterProps } from "../accounts/Accounts";

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15
  };

  fetchBlocks = async (count: number, endTimestamp?: number) => {
    return await new BlocksApi().getBlocks(count, endTimestamp);
  };

  autoRefreshBlocks = autoRefreshHandler(
    Blocks,
    this.fetchBlocks,
    this.props.count,
    true
  );

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
    if (items.length === 0) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        <BlocksList blocks={items} />
      </FlipMove>
    );
  }
}
