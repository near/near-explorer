import LoadingOverlay from "react-loading-overlay";

import BlocksApi from "../../libraries/explorer-wamp/blocks";

import BlocksRow from "./BlocksRow";

export default class extends React.Component {
  componentDidMount() {
    this._blocksApi = new BlocksApi();

    this._blockLoader = document.getElementById("block-loader");
    document.addEventListener("scroll", this._onScroll);

    this._loadBlocks();

    this._blocksApi.getTotal().then(total => {
      this.props.setPagination(pagination => {
        return { ...pagination, total };
      });
    });
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this._onScroll);
  }

  render() {
    const { blocks } = this.props;

    return (
      <LoadingOverlay
        active={this.props.loading}
        spinner
        text="Loading blocks..."
      >
        <div id="block-loader">
          {blocks.map(block => (
            <BlocksRow key={block.hash} block={block} />
          ))}
        </div>
      </LoadingOverlay>
    );
  }

  _isAtBottom = () => {
    return (
      this._blockLoader.getBoundingClientRect().bottom <= window.innerHeight
    );
  };

  _onScroll = async () => {
    if (this._isAtBottom()) {
      document.removeEventListener("scroll", this._onScroll);

      await this._loadBlocks();

      // Add the listener again.
      document.addEventListener("scroll", this._onScroll);
    }
  };

  _loadBlocks = async () => {
    let blocks;
    if (this.props.pagination.stop === null) {
      blocks = await this._blocksApi.getLatestBlocksInfo();
    } else {
      blocks = await this._getNextBatch(this.props.pagination);
    }
    if (blocks.length > 0) {
      this.props.setBlocks(_blocks => {
        _blocks.push(...blocks);
        return _blocks;
      });
      this.props.setPagination(pagination => {
        return { ...pagination, stop: blocks[blocks.length - 1].height };
      });
    }
  };

  _getNextBatch = async pagination => {
    this.props.setLoading(true);

    let blocks = [];
    try {
      if (pagination.search) {
        blocks = await this._blocksApi.searchBlocks(
          pagination.search,
          pagination.stop
        );
      } else {
        blocks = await this._blocksApi.getPreviousBlocks(
          pagination.stop,
          pagination.count
        );
      }
    } catch (err) {
      console.error("Blocks.getNextBatch failed to fetch data due to:");
      console.error(err);
    }

    this.props.setLoading(false);

    return blocks;
  };
}
