import * as T from "../../../libraries/explorer-wamp/transactions";

export const TRANSACTIONS: T.Transaction[] = [
  // no action has deposit
  {
    hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    signerId: "signer.test",
    receiverId: "receiver.test",
    status: "SuccessValue",
    blockHash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    gasPrice: "5000",
    actions: [
      {
        kind: "CreateAccount",
        args: {},
      },
      {
        kind: "AddKey",
        args: {
          access_key: {
            nonce: 0,
            permission: "FullAccess",
          },
          public_key: "ed25519:8LXEySyBYewiTTLxjfF1TKDsxxxxxxxxxxxxxxxxxx",
        },
      },
    ],
    receiptsOutcome: [
      {
        id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: ["A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v"],
          status: { SuccessValue: null },
          gas_burnt: 0,
        },
      },
      {
        id: "A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: ["LOG: Counter is now: 1"],
          receipt_ids: [
            "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
            "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
          ],
          status: {
            SuccessReceiptId: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
          },
          gas_burnt: 0,
        },
      },
      {
        id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: { SuccessValue: "" },
          gas_burnt: 0,
        },
      },
      {
        id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: { SuccessValue: "" },
          gas_burnt: 0,
        },
      },
    ],
    transactionOutcome: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs"],
        status: { SuccessValue: null },
        gas_burnt: 0,
      },
    },
  },
  //one deposit with small amount
  {
    hash: "222eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    signerId: "signer2.test",
    receiverId: "receiver2.test",
    status: "SuccessValue",
    blockHash: "222BBBgnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    gasPrice: "5000",
    actions: [
      {
        kind: "FunctionCall",
        args: {
          result: "",
          args: "eyJ0ZXh0Ijoid2hlbiBpY28/In0=",
          deposit: "100000",
          gas: 2000000,
          method_name: "addMessage",
        },
      },
    ],
    receiptsOutcome: [
      {
        id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
        block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: {
            Failure: {
              error_message: "Exceeded the prepaid gas.",
              error_type: "ActionError::FunctionCallError",
            },
          },
          gas_burnt: 0,
        },
      },
    ],
    transactionOutcome: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
        status: { SuccessValue: null },
        gas_burnt: 0,
      },
    },
  },
  //multi deposit with huge amount
  {
    hash: "222eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVxxx",
    signerId: "signer2.test",
    receiverId: "receiver2.test",
    status: "SuccessValue",
    blockHash: "222BBBgnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    gasPrice: "5000",
    actions: [
      {
        kind: "Transfer",
        args: {
          deposit: "50000000000000000000",
        },
      },
      {
        kind: "Transfer",
        args: {
          deposit: "90000000000000000000",
        },
      },
    ],
    receiptsOutcome: [
      {
        id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
        block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
        outcome: {
          logs: ["LOG: Counter is now: 1"],
          receipt_ids: [],
          status: { SuccessValue: "" },
          gas_burnt: 0,
        },
      },
    ],
    transactionOutcome: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
        status: { SuccessValue: null },
        gas_burnt: 0,
      },
    },
  },
];
