import renderer from "react-test-renderer";

import ActionRow from "../ActionRow";

const TRANSACTION = {
  hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
  signerId: "signer.test",
  receiverId: "receiver.test",
  blockTimestamp: +new Date(2019, 1, 1)
};

describe("<ActionRow />", () => {
  it("renders sparsely by default", () => {
    expect(
      renderer.create(
        <ActionRow transaction={TRANSACTION} action={"CreateAccount"} />
      )
    ).toMatchSnapshot();
  });

  it("renders compact", () => {
    expect(
      renderer.create(
        <ActionRow
          viewMode="compact"
          transaction={TRANSACTION}
          action={"CreateAccount"}
        />
      )
    ).toMatchSnapshot();
  });
});
