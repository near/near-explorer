import React from "react";

import Pagination from "../utils/Pagination";

export interface Props {
  accountId?: string;
  blockHash?: string;
  reversed: boolean;
  limit: number;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    reversed: false,
    limit: 15
  };

  render() {
    return (
      <Pagination
        reversed={this.props.reversed}
        limit={this.props.limit}
        genre="Transaction"
        accountId={this.props.accountId}
      />
    );
  }
}
