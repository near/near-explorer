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
    transactionIndex: 0,
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
    receipts: [
      {
        predecessor_id: "signer.test",
        receipt: [
          {
            kind: "FunctionCall",
            args: {
              args: "eyJyZXF1ZXN0X2lkIjoxMn0=",
              deposit: "0",
              gas: 5555555555555,
              method_name: "confirm",
            },
          },
        ],
        receipt_id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
        receiver_id: "receiver.test",
      },
      {
        predecessor_id: "signer.test",
        receipt: {
          Action: {
            actions: [
              {
                FunctionCall: {
                  args:
                    "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
                  deposit: "0",
                  gas: 3333333333333333,
                  method_name: "unstake",
                },
              },
            ],
            gas_price: "451542320",
            input_data_ids: [],
            output_data_receivers: [],
            signer_id: "signer.test",
            signer_public_key:
              "ed25519:7YpMmoACVQ7Fu3ZJAfwH6QhQEnxxxxxxxxxxxxxxxxxx",
          },
        },
        receipt_id: "A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v",
        receiver_id: "receiver.test",
      },
      {
        predecessor_id: "signer.test",
        receipt: {
          Action: {
            actions: [
              {
                FunctionCall: {
                  args:
                    "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
                  deposit: "0",
                  gas: 12512121223123,
                  method_name: "unstake",
                },
              },
            ],
            gas_price: "451542320",
            input_data_ids: [],
            output_data_receivers: [],
            signer_id: "signer.test",
            signer_public_key:
              "ed25519:7YpMmoACVQ7Fu3ZJAfwH6QhQEnxxxxxxxxxxxxxxxxxx",
          },
        },
        receipt_id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
        receiver_id: "receiver.test",
      },
      {
        predecessor_id: "signer.test",
        receipt: {
          Action: {
            actions: [
              {
                FunctionCall: {
                  args:
                    "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
                  deposit: "0",
                  gas: 25252525002200,
                  method_name: "on_staking_pool_unstake",
                },
              },
            ],
            gas_price: "451542320",
            input_data_ids: [],
            output_data_receivers: [],
            signer_id: "signer.test",
            signer_public_key:
              "ed25519:7YpMmoACVQ7Fu3ZJAfwH6QhQEnxxxxxxxxxxxxxxxxxx",
          },
        },
        receipt_id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
        receiver_id: "receiver.test",
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
          gas_burnt: 100000,
          tokens_burnt: "12345678987654",
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
          gas_burnt: 999999999,
          tokens_burnt: "5678987654567",
        },
      },
      {
        id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: { SuccessValue: "" },
          gas_burnt: 55555555,
          tokens_burnt: "2345678987654321",
        },
      },
      {
        id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: { SuccessValue: "" },
          gas_burnt: 444444444444,
          tokens_burnt: "654345678876543",
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
        gas_burnt: 333,
        tokens_burnt: "163548451464",
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
    transactionIndex: 0,
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
    receipts: [
      {
        predecessor_id: "signer2.test",
        receipt: {
          Action: {
            actions: [
              {
                FunctionCall: {
                  args:
                    "eyJyZXF1ZXN0Ijp7ImxlZnQiOjMwMjA1MzEyLCJyaWdodCI6Mjk0MDIzNDJ9LCJyZXNwb25zZSI6IlNlbGVjdGVkUmlnaHQifQ==",
                  deposit: "0",
                  gas: 100000000000000,
                  method_name: "vote",
                },
              },
            ],
            gas_price: "451542320",
            input_data_ids: [],
            output_data_receivers: [],
            signer_id: "signer.test",
            signer_public_key:
              "ed25519:7YpMmoACVQ7Fu3ZJAfwH6QhQEnxxxxxxxxxxxxxxxxxx",
          },
        },
        receipt_id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
        receiver_id: "receiver2.test",
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
          gas_burnt: 222222,
          tokens_burnt: "231549875456",
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
        gas_burnt: 1111111,
        tokens_burnt: "12315657498754",
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
    transactionIndex: 0,
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
    receipts: [
      {
        predecessor_id: "signer2.test",
        receipt: {
          Action: {
            actions: [
              {
                Transfer: {
                  deposit: "33221122334455",
                },
              },
            ],
            gas_price: "451542320",
            input_data_ids: [],
            output_data_receivers: [],
            signer_id: "signer.test",
            signer_public_key:
              "ed25519:7YpMmoACVQ7Fu3ZJAfwH6QhQEnxxxxxxxxxxxxxxxxxx",
          },
        },
        receipt_id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
        receiver_id: "receiver2.test",
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
          gas_burnt: 123123123,
          tokens_burnt: "0",
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
        gas_burnt: 456456,
        tokens_burnt: "456456",
      },
    },
  },
];

export const RECEIPT_OUTCOMES_BY_ID = [
  // for those no action has deposit
  {
    ["9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs"]: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v"],
        status: { SuccessValue: null },
        gas_burnt: 100000,
        tokens_burnt: "12345678987654",
      },
    },
    ["A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v"]: {
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
        gas_burnt: 999999999,
        tokens_burnt: "5678987654567",
      },
    },
    ["A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111"]: {
      id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: [],
        status: { SuccessValue: "" },
        gas_burnt: 55555555,
        tokens_burnt: "2345678987654321",
      },
    },
    ["A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222"]: {
      id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: [],
        status: { SuccessValue: "" },
        gas_burnt: 444444444444,
        tokens_burnt: "654345678876543",
      },
    },
  },
  // for those one deposit with small amount
  {
    ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"]: {
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
        gas_burnt: 222222,
        tokens_burnt: "231549875456",
      },
    },
  },
  // for those multi deposit with huge amount
  {
    ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"]: {
      id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
      block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
      outcome: {
        logs: ["LOG: Counter is now: 1"],
        receipt_ids: [],
        status: { SuccessValue: "" },
        gas_burnt: 123123123,
        tokens_burnt: "0",
      },
    },
  },
];

export const RECEIPTS_BY_ID = [
  {
    ["9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs"]: {
      predecessor_id: "signer.test",
      receipt: [
        {
          kind: "FunctionCall",
          args: {
            args: "eyJyZXF1ZXN0X2lkIjoxMn0=",
            deposit: "0",
            gas: 5555555555555,
            method_name: "confirm",
          },
        },
      ],
      receipt_id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      receiver_id: "receiver.test",
    },
    ["A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v"]: {
      predecessor_id: "signer.test",
      receipt: [
        {
          kind: "FunctionCall",
          args: {
            args: "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
            deposit: "0",
            gas: 3333333333333333,
            method_name: "unstake",
          },
        },
      ],
      receipt_id: "A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v",
      receiver_id: "receiver.test",
    },
    ["A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111"]: {
      predecessor_id: "signer.test",
      receipt: [
        {
          kind: "FunctionCall",
          args: {
            args: "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
            deposit: "0",
            gas: 12512121223123,
            method_name: "unstake",
          },
        },
      ],
      receipt_id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
      receiver_id: "receiver.test",
    },
    ["A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222"]: {
      predecessor_id: "signer.test",
      receipt: [
        {
          kind: "FunctionCall",
          args: {
            args: "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
            deposit: "0",
            gas: 25252525002200,
            method_name: "on_staking_pool_unstake",
          },
        },
      ],
      receipt_id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
      receiver_id: "receiver.test",
    },
  },
  {
    ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"]: {
      predecessor_id: "signer2.test",
      receipt: [
        {
          kind: "FunctionCall",
          args: {
            args:
              "eyJyZXF1ZXN0Ijp7ImxlZnQiOjMwMjA1MzEyLCJyaWdodCI6Mjk0MDIzNDJ9LCJyZXNwb25zZSI6IlNlbGVjdGVkUmlnaHQifQ==",
            deposit: "10000000000001",
            gas: 100000000000000,
            method_name: "vote",
          },
        },
      ],
      receipt_id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
      receiver_id: "receiver2.test",
    },
  },
  {
    ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"]: {
      predecessor_id: "signer2.test",
      receipt: [
        {
          kind: "Transfer",
          args: {
            deposit: "33221122334455",
          },
        },
      ],
      receipt_id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
      receiver_id: "receiver2.test",
    },
  },
];
