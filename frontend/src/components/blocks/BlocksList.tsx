import InfiniteScroll from "react-infinite-scroll-component";

import React from "react";

import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";

import BlocksRow from "./BlocksRow";
import PaginationSpinner from "../utils/PaginationSpinner";

export interface Props {
  blocks: B.BlockInfo[];
  setBlocks: Function;
  limit: number;
}

export default class extends React.Component<Props> {
  _blocksApi: BlocksApi | null;

  constructor(props: Props) {
    super(props);
    this._blocksApi = null;
  }

  fetchMoreBlocks = async () => {
    if (this._blocksApi === null) {
      this._blocksApi = new BlocksApi();
    }
    const lastHeight = this.props.blocks[this.props.blocks.length - 1].height;
    const blocks = await this._blocksApi.getBlocks(
      this.props.limit,
      lastHeight
    );
    if (blocks.length > 0) {
      this.props.setBlocks((_blocks: B.BlockInfo[]) => {
        return _blocks.concat(...blocks);
      });
    }
  };

  render() {
    const { blocks } = this.props;
    const blockRow = blocks.map(block => (
      <BlocksRow key={block.hash + block.timestamp} block={block} />
    ));
    return (
      <InfiniteScroll
        dataLength={this.props.blocks.length}
        next={this.fetchMoreBlocks}
        hasMore={true}
        loader={<PaginationSpinner hidden={false} />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {blockRow}
      </InfiniteScroll>
    );
  }
}
