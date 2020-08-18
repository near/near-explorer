import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeConsumer } from "../../context/NodeProvider";

import NodeRow from "./NodeRow";
import PaginationSpinner from "../utils/PaginationSpinner";

export default class extends React.Component {
  render() {
    return (
      <NodeConsumer>
        {(context) => (
          <>
            {context.onlineNodes ? (
              context.onlineNodes.map((node: N.NodeInfo) => (
                <NodeRow key={node.nodeId} node={node} />
              ))
            ) : (
              <PaginationSpinner hidden={false} />
            )}
          </>
        )}
      </NodeConsumer>
    );
  }
}
