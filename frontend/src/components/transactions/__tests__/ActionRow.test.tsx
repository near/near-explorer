import renderer from "react-test-renderer";

import ActionRow from "../ActionRow";

import { TRANSACTIONS } from "./common";

describe("<ActionRow />", () => {
  it("renders sparsely by default", () => {
    expect(
      renderer.create(
        <ActionRow transaction={TRANSACTIONS[0]} action={"CreateAccount"} />
      )
    ).toMatchSnapshot();
  });

  it("renders compact", () => {
    expect(
      renderer.create(
        <ActionRow
          viewMode="compact"
          transaction={TRANSACTIONS[0]}
          action={"CreateAccount"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders functioncall with details", () => {
    expect(
      renderer.create(
        <ActionRow
          transaction={TRANSACTIONS[1]}
          action={{
            FunctionCall: {
              args: "eyJ2YWx1ZSI6MX0=",
              deposit: "1",
              gas: 2000000000000,
              method_name: "incrementCounter"
            }
          }}
          showDetails
        />
      )
    ).toMatchSnapshot();
  });
});
