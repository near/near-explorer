import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeConsumer } from "../../context/NodeProvider";

import ValidatorRow from "./ValidatorRow";
import PaginationSpinner from "../utils/PaginationSpinner";

export default class extends React.Component {
  render() {
    return (
      <NodeConsumer>
        {(context) => (
          <>
            {context.nodeInfo.validators ? (
              context.nodeInfo.validators.map((node: N.Validating) => (
                <ValidatorRow key={node.account_id} node={node} />
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
