import React from "react";

import Pagination from "../utils/Pagination";

export interface Props {
  limit: number;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    limit: 15
  };

  render() {
    return <Pagination limit={this.props.limit} genre="Account" />;
  }
}
