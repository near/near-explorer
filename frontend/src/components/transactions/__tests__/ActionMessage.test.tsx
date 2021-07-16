import { renderI18nElement } from "../../../libraries/tester";

import ActionMessage from "../ActionMessage";

import { TRANSACTIONS } from "./common";

describe("<ActionMessage />", () => {
  it("renders CreateAccount", () => {
    expect(
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
      renderI18nElement(
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
