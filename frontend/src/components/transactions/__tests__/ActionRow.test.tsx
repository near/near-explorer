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
});
