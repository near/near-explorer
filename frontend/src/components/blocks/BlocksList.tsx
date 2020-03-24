import React from "react";

import * as B from "../../libraries/explorer-wamp/blocks";

import BlocksRow from "./BlocksRow";
export interface Props {
  blocks: B.BlockInfo[];
}

export default class extends React.Component<Props> {
  render() {
    const { blocks } = this.props;
    const blockRow = blocks.map((block) => (
      <BlocksRow key={block.hash} block={block} />
    ));
    return <>{blockRow}</>;
  }
}
