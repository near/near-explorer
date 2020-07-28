import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { SubConsumer } from "../../context/SubscriptionProvider";

import ValidatorRow from "./ValidatorRow";
import PaginationSpinner from "../utils/PaginationSpinner";

export default class extends React.Component {
  render() {
    return (
      <SubConsumer>
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
      </SubConsumer>
    );
  }
}
