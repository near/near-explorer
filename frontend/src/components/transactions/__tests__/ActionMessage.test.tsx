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
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeleteAccount", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"DeleteAccount"}
          actionArgs={{ beneficiary_id: "near" }}
          receiverId={TRANSACTIONS[0].receiverId}
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
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders FunctionCall", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"FunctionCall"}
          actionArgs={{ method_name: "method_name", args: "e30=" }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders FunctionCall with details", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"FunctionCall"}
          actionArgs={{
            method_name: "method_name",
            args: "eyJ0ZXh0Ijoid2hlbiBpY28/In0=",
          }}
          receiverId={TRANSACTIONS[1].receiverId}
          showDetails
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
          receiverId={TRANSACTIONS[0].receiverId}
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
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey with permission function call to call any method", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"AddKey"}
          actionArgs={{
            access_key: {
              permission: {
                FunctionCall: {
                  method_names: [],
                  receiver_id: "stake",
                },
              },
              nonce: 0,
            },
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey with permission function call to call specific methods", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"AddKey"}
          actionArgs={{
            access_key: {
              permission: {
                FunctionCall: {
                  method_names: [
                    "add_request",
                    "delete_request",
                    "confirm",
                    "add_request_and_confirm",
                  ],
                  receiver_id: "stake",
                },
              },
              nonce: 0,
            },
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey with permission FullAccess", () => {
    expect(
      renderer.create(
        <ActionMessage
          actionKind={"AddKey"}
          actionArgs={{
            access_key: {
              nonce: 0,
              permission: "FullAccess",
            },
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
          }}
          receiverId={TRANSACTIONS[0].receiverId}
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
            public_key: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });
});
