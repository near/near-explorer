import React from "react";

import Pagination from "../utils/Pagination";

export interface Props {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  paginationSize: number;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    reversed: false,
    paginationSize: 15
  };

  render() {
    return (
      <Pagination
        reversed={this.props.reversed}
        paginationSize={this.props.paginationSize}
        genre="Transaction"
        accountId={this.props.accountId}
      />
    );
  }
}
