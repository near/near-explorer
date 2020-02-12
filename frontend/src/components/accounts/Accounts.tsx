import React from "react";

import Pagination from "../utils/Pagination";

export interface Props {
  paginationSize: number;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    paginationSize: 15
  };

  render() {
    return (
      <Pagination paginationSize={this.props.paginationSize} genre="Account" />
    );
  }
}
