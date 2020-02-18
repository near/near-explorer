import React from "react";
import PaginationSpinner from "../utils/PaginationSpinner";

import BlocksList from "./BlocksList";
import BlocksApi, * as B from "../../libraries/explorer-wamp/blocks";

import FlipMove from "../utils/FlipMove";

export interface Props {
  limit: number;
}

export interface State {
  blocks: B.BlockInfo[];
  loading: boolean;
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    limit: 15
  };

  state: State = {
    loading: true,
    blocks: []
  };

  _blocksApi: BlocksApi | null;
  timer: ReturnType<typeof setTimeout> | null;
  _blockLoader: Element | null;

  constructor(props: Props) {
    super(props);
    this._blocksApi = null;
    this.timer = null;
    this._blockLoader = null;
  }

  componentDidMount() {
    this._blocksApi = new BlocksApi();
    document.addEventListener("scroll", this._onScroll);
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this._onScroll);
    clearTimeout(this.timer!);
    this.timer = null;
  }

  regularFetchInfo = async () => {
    await this.getBlocks();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  getBlocks = async () => {
    if (this._blocksApi === null) {
      this._blocksApi = new BlocksApi();
    }
    let blocks;
    if (this.state.blocks.length === 0) {
      blocks = await this._blocksApi.getBlocks(this.props.limit);
    } else {
      blocks = await this._blocksApi.getBlocks(this.state.blocks.length);
    }
    this.setState({ blocks });
  };

  _isAtBottom = () => {
    return (
      this._blockLoader &&
      this._blockLoader.getBoundingClientRect().bottom <= window.innerHeight
    );
  };

  _onScroll = async () => {
    this._blockLoader = document.querySelector("#block");
    const bottom = this._isAtBottom();
    if (bottom) {
      document.removeEventListener("scroll", this._onScroll);

      await this._loadBlocks();
      this.setState({ loading: false });

      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadBlocks = async () => {
    const count = await this._getLength();
    if (count) {
      if (count <= this.state.blocks.length) {
        this.setState({ loading: false });
      } else {
        await Promise.all([
          this.setState({ loading: true }),
          this._addBlocks()
        ]);
      }
    }
  };

  _getLength = async () => {
    if (this._blocksApi === null) {
      this._blocksApi = new BlocksApi();
    }
    const count = await this._blocksApi.getBlockLength();
    return count;
  };

  _addBlocks = async () => {
    if (this._blocksApi === null) {
      this._blocksApi = new BlocksApi();
    }
    const lastIndex = this.state.blocks[this.state.blocks.length - 1].height;
    const blocks = await this._blocksApi.getBlocks(this.props.limit, lastIndex);
    console.log(blocks);
  };

  render() {
    const { blocks, loading } = this.state;
    if (blocks === []) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        <div id="block" />
        <FlipMove duration={1000} staggerDurationBy={0}>
          <BlocksList blocks={blocks} />
        </FlipMove>
        {loading && <PaginationSpinner hidden={false} />}
      </>
    );
  }
}
