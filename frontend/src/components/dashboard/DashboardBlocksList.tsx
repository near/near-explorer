import React from "react";

import DashboardBlocksBlock from "./DashboardBlocksBlock";

import { Props } from "../blocks/BlocksList";

export default class extends React.Component<Props> {
  render() {
    const { blocks } = this.props;
    const blockRow = blocks.map((block) => (
      <DashboardBlocksBlock key={block.hash} block={block} />
    ));
    return <>{blockRow}</>;
  }
}
