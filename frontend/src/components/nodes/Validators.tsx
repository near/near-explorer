import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeConsumer } from "../../context/NodeProvider";

import ValidatorRow from "./ValidatorRow";
import PaginationSpinner from "../utils/PaginationSpinner";

class Validators extends React.PureComponent {
  render() {
    return (
      <NodeConsumer>
        {(context) => (
          <>
            {context.validators ? (
              context.validators.map((node: N.Validating) => (
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

export default Validators;
