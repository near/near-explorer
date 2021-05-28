import renderer from "react-test-renderer";

import ActionRow from "../ActionRow";

import { TRANSACTIONS } from "./common";
import * as T from "../../../libraries/explorer-wamp/transactions";

describe("<ActionRow />", () => {
  it("renders sparsely by default", () => {
    expect(
      renderer.create(
        <ActionRow
          actionBlock={TRANSACTIONS[0]}
          action={{
            kind: "CreateAccount",
            args: {},
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact", () => {
    expect(
      renderer.create(
        <ActionRow
          viewMode="compact"
          actionBlock={TRANSACTIONS[0]}
          action={{
            kind: "AddKey",
            args: {
              access_key: {
                nonce: 0,
                permission: "FullAccess",
              },
              public_key: "ed25519:8LXEySyBYewiTTLxjfF1TKDsxxxxxxxxxxxxxxxxxx",
            },
          }}
        />
      )
    ).toMatchSnapshot();
  });

  const actionFunctionCall = {
    kind: "FunctionCall",
    args: {
      args: "eyJ2YWx1ZSI6MX0=",
      deposit: "1",
      gas: 2000000000000,
      method_name: "incrementCounter",
    },
  } as T.Action;

  it("renders functioncall with detail", () => {
    expect(
      renderer.create(
        <ActionRow
          actionBlock={TRANSACTIONS[0]}
          action={actionFunctionCall}
          showDetails
        />
      )
    ).toMatchSnapshot();
  });
});
