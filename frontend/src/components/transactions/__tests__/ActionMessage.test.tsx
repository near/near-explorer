import renderer from "react-test-renderer";

import ActionMessage from "../ActionMessage";

import { TRANSACTIONS } from "./common";

describe("<ActionMessage />", () => {
  it("renders CreateAccount", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"CreateAccount"}
          actionArgs={{}}
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
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
          transaction={TRANSACTIONS[0]}
        />
      )
    ).toMatchSnapshot();
  });
});
