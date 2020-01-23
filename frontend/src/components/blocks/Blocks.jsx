import PaginationSpinner from "../utils/PaginationSpinner";

import BlocksList from "./BlocksList";

export default class extends React.Component {
  state = {
    loading: false,
    blocks: [],
    pagination: {
      start: null,
      stop: null,
      newBlocks: 0,
      count: 15,
      search: ""
    }
  };

  render() {
    return (
      <>
        <BlocksList
          blocks={this.state.blocks}
          pagination={this.state.pagination}
          loading={this.state.loading}
          setLoading={this._setLoading}
          setBlocks={this._setBlocks}
          setPagination={this._setPagination}
        />
        <PaginationSpinner hidden={false} />
      </>
    );
  }

  _setLoading = loading => {
    this.setState({ loading });
  };

  _setBlocks = callback => {
    this.setState(state => {
      return { ...state, blocks: callback(state.blocks) };
    });
  };

  _setPagination = callback => {
    this.setState(state => {
      return { ...state, pagination: callback(state.pagination) };
    });
  };
}
