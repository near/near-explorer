import * as React from "react";

import ActionMessage from "@/frontend/components/transactions/ActionMessage";
import { renderElement } from "@/frontend/testing/utils";

import { TRANSACTIONS } from "./common";

describe("<ActionMessage />", () => {
  it("renders CreateAccount", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "createAccount",
            args: {},
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeleteAccount", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "deleteAccount",
            args: { beneficiaryId: "near" },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeployContract", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "deployContract",
            args: { code: "0" },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders FunctionCall", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "functionCall",
            args: {
              methodName: "method_name",
              args: "e30=",
              gas: 1,
              deposit: "0",
            },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders FunctionCall with details", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "functionCall",
            args: {
              methodName: "method_name",
              args: "eyJ0ZXh0Ijoid2hlbiBpY28/In0=",
              gas: 1,
              deposit: "0",
            },
          }}
          receiverId={TRANSACTIONS[1].receiverId}
          showDetails
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Transfer", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "transfer",
            args: { deposit: "1" },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Stake", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "stake",
            args: {
              stake: "1",
              publicKey: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
            },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey with permission function call to call any method", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "addKey",
            args: {
              accessKey: {
                permission: {
                  type: "functionCall",
                  methodNames: [],
                  contractId: "stake",
                },
                nonce: 0,
              },
              publicKey: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
            },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey with permission function call to call specific methods", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "addKey",
            args: {
              accessKey: {
                permission: {
                  type: "functionCall",
                  methodNames: [
                    "add_request",
                    "delete_request",
                    "confirm",
                    "add_request_and_confirm",
                  ],
                  contractId: "stake",
                },
                nonce: 0,
              },
              publicKey: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
            },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders AddKey with permission FullAccess", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "addKey",
            args: {
              accessKey: {
                nonce: 0,
                permission: { type: "fullAccess" },
              },
              publicKey: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
            },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders DeleteKey", () => {
    expect(
      renderElement(
        <ActionMessage
          action={{
            kind: "deleteKey",
            args: {
              publicKey: "ed25519:BgXFiJSzXz8VNFSW32rYNBiU7fUotKKeeDtPiSMkXMhx",
            },
          }}
          receiverId={TRANSACTIONS[0].receiverId}
        />
      )
    ).toMatchSnapshot();
  });
});
