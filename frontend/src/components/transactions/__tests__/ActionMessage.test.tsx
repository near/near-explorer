import renderer from "react-test-renderer";

import ActionMessage from "../ActionMessage";

const TRANSACTION = {
  hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
  signerId: "signer.test",
  receiverId: "receiver.test",
  blockTimestamp: +new Date(2019, 1, 1)
};

describe("<ActionMessage />", () => {
  it("renders CreateAccount", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"CreateAccount"}
          actionArgs={{}}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeleteAccount", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"DeleteAccount"}
          actionArgs={{}}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeployContract", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"DeployContract"}
          actionArgs={{}}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders FunctionCall", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"FunctionCall"}
          actionArgs={{}}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Transfer", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"Transfer"}
          actionArgs={{ deposit: "1" }}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Stake", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"Stake"}
          actionArgs={{
            stake: "1",
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx"
          }}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"AddKey"}
          actionArgs={{
            access_key: {},
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx"
          }}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeleteKey", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"DeleteKey"}
          actionArgs={{
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx"
          }}
          transaction={TRANSACTION}
        />
      )
    ).toMatchSnapshot();
  });
});
