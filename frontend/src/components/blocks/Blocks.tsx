import React from "react";
import Pagination from "../utils/Pagination";

export interface Props {
  paginationSize: number;
}
export default class extends React.Component<Props> {
  render() {
    return <Pagination paginationSize={15} genre="Block" />;
  }
}
