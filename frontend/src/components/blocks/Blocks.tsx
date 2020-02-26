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
}

interface CallBack {
  (myArgument: B.BlockInfo[]): B.BlockInfo[];
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    limit: 15
  };

  state: State = {
    blocks: []
  };

  _blocksApi: BlocksApi | null;
  timer: ReturnType<typeof setTimeout> | null;

  constructor(props: Props) {
    super(props);
    this._blocksApi = null;
    this.timer = null;
  }

  componentDidMount() {
    this._blocksApi = new BlocksApi();
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
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
    if (blocks.length > 0) {
      this.setState({ blocks });
    }
  };

  setBlocks = (callback: CallBack) => {
    this.setState(state => {
      return { ...state, blocks: callback(state.blocks) };
    });
  };

  render() {
    const { blocks } = this.state;
    if (blocks === []) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        <div id="block" />
        <FlipMove duration={1000} staggerDurationBy={0}>
          <BlocksList
            blocks={blocks}
            setBlocks={this.setBlocks}
            limit={this.props.limit}
          />
        </FlipMove>
      </>
    );
  }
}
