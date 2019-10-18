import * as T from "../../../libraries/explorer-wamp/transactions";

export const TRANSACTIONS: T.Transaction[] = [
  {
    hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    signerId: "signer.test",
    receiverId: "receiver.test",
    status: "Completed",
    blockHash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    actions: [
      "CreateAccount" as keyof T.Action,
      {
        Transfer: {
          deposit: "10000000000000000000"
        } as T.Transfer
      } as T.Action,
      {
        AddKey: {
          access_key: {
            nonce: 0,
            permission: "FullAccess"
          },
          public_key: "ed25519:8LXEySyBYewiTTLxjfF1TKDsxxxxxxxxxxxxxxxxxx"
        } as T.AddKey
      } as T.Action
    ],
    receipts: [
      {
        hash: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
        result: {
          logs: [],
          receipts: ["A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v"],
          result: null,
          status: "Completed"
        }
      },
      {
        hash: "A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v",
        result: {
          logs: ["LOG: Counter is now: 1"],
          receipts: ["A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK3dgp"],
          result: "",
          status: "Completed"
        }
      },
      {
        hash: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK3dgp",
        result: {
          logs: [],
          receipts: [],
          result: "",
          status: "Completed"
        }
      }
    ]
  },

  {
    hash: "222eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    signerId: "signer2.test",
    receiverId: "receiver2.test",
    status: "Completed",
    blockHash: "222BBBgnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    actions: [
      {
        FunctionCall: {
          args: "eyJ0ZXh0Ijoid2hlbiBpY28/In0=",
          deposit: "0",
          gas: 2000000,
          method_name: "addMessage"
        }
      } as T.Action
    ],
    receipts: []
  }
];
