import { Receipt, TransactionOld } from "../../../types/common";

export const TRANSACTIONS: TransactionOld[] = [
  // no action has deposit
  {
    hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    signerId: "signer.test",
    receiverId: "receiver.test",
    status: "success",
    blockHash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    actions: [
      {
        kind: "createAccount",
        args: {},
      },
      {
        kind: "addKey",
        args: {
          accessKey: {
            nonce: 0,
            permission: { type: "fullAccess" },
          },
          publicKey: "ed25519:8LXEySyBYewiTTLxjfF1TKDsxxxxxxxxxxxxxxxxxx",
        },
      },
    ],
    receipt: {
      actions: [
        {
          kind: "functionCall",
          args: {
            args: "eyJyZXF1ZXN0X2lkIjoxMn0=",
            deposit: "0",
            gas: 5555555555555,
            methodName: "confirm",
          },
        },
      ],
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        outgoing_receipts: [
          {
            actions: [
              {
                kind: "functionCall",
                args: {
                  args: "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
                  deposit: "0",
                  gas: 3333333333333333,
                  methodName: "unstake",
                },
              },
            ],
            block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
            outcome: {
              logs: ["LOG: Counter is now: 1"],
              outgoing_receipts: [
                {
                  actions: [
                    {
                      kind: "functionCall",
                      args: {
                        args: "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
                        deposit: "0",
                        gas: 12512121223123,
                        methodName: "unstake",
                      },
                    },
                  ],
                  block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
                  outcome: {
                    logs: [],
                    outgoing_receipts: [],
                    status: { type: "successValue", value: "" },
                    gas_burnt: 55555555,
                    tokens_burnt: "2345678987654321",
                  },
                  predecessor_id: "signer.test",
                  receipt_id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
                  receiver_id: "receiver.test",
                },
                {
                  actions: [
                    {
                      kind: "functionCall",
                      args: {
                        args: "eyJhbW91bnQiOiIxNzU2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9",
                        deposit: "0",
                        gas: 25252525002200,
                        methodName: "on_staking_pool_unstake",
                      },
                    },
                  ],
                  block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
                  outcome: {
                    logs: [],
                    outgoing_receipts: [],
                    status: { type: "successValue", value: "" },
                    gas_burnt: 444444444444,
                    tokens_burnt: "654345678876543",
                  },
                  predecessor_id: "signer.test",
                  receipt_id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
                  receiver_id: "receiver.test",
                },
              ],
              status: {
                type: "successReceiptId",
                receiptId: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
              },
              gas_burnt: 999999999,
              tokens_burnt: "5678987654567",
            },
            predecessor_id: "signer.test",
            receipt_id: "A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v",
            receiver_id: "receiver.test",
          },
        ],
        status: { type: "successValue", value: "" },
        gas_burnt: 100000,
        tokens_burnt: "12345678987654",
      },
      predecessor_id: "signer.test",
      receipt_id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      receiver_id: "receiver.test",
    },
    receiptsOutcome: [
      {
        id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: ["A8HaLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQvN3v"],
          status: { type: "successValue", value: "" },
          gas_burnt: 100000,
          tokens_burnt: "12345678987654",
          executor_id: "signer.test",
          metadata: {
            version: 1,
            gas_profile: null,
          },
        },
        proof: [],
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
            type: "successReceiptId",
            receiptId: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
          },
          gas_burnt: 999999999,
          tokens_burnt: "5678987654567",
          executor_id: "signer.test",
          metadata: {
            version: 1,
            gas_profile: null,
          },
        },
        proof: [],
      },
      {
        id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK1111",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: { type: "successValue", value: "" },
          gas_burnt: 55555555,
          tokens_burnt: "2345678987654321",
          executor_id: "signer.test",
          metadata: {
            version: 1,
            gas_profile: null,
          },
        },
        proof: [],
      },
      {
        id: "A5oSQ6z71zWi3X1KFy9xhNzyjj8bQx4wwboWUMnK2222",
        block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: { type: "successValue", value: "" },
          gas_burnt: 444444444444,
          tokens_burnt: "654345678876543",
          executor_id: "signer.test",
          metadata: {
            version: 1,
            gas_profile: null,
          },
        },
        proof: [],
      },
    ],
    transactionOutcome: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs"],
        status: { type: "successValue", value: "" },
        gas_burnt: 333,
        tokens_burnt: "163548451464",
        executor_id: "signer.test",
        metadata: {
          version: 1,
          gas_profile: null,
        },
      },
      proof: [],
    },
  },
  //one deposit with small amount
  {
    hash: "222eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    signerId: "signer2.test",
    receiverId: "receiver2.test",
    status: "success",
    blockHash: "222BBBgnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    actions: [
      {
        kind: "functionCall",
        args: {
          args: "eyJ0ZXh0Ijoid2hlbiBpY28/In0=",
          deposit: "100000",
          gas: 2000000,
          methodName: "addMessage",
        },
      },
    ],
    receipt: {
      actions: [
        {
          kind: "functionCall",
          args: {
            args: "eyJyZXF1ZXN0Ijp7ImxlZnQiOjMwMjA1MzEyLCJyaWdodCI6Mjk0MDIzNDJ9LCJyZXNwb25zZSI6IlNlbGVjdGVkUmlnaHQifQ==",
            deposit: "0",
            gas: 100000000000000,
            methodName: "vote",
          },
        },
      ],
      block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
      outcome: {
        logs: [],
        outgoing_receipts: [],
        status: {
          type: "failure",
          error: {
            type: "action",
            error: {
              type: "functionCallError",
              error: {
                type: "executionError",
                error: "Smart contract panicked: ERR_INCORRECT_NONCE",
              },
            },
          },
        },
        gas_burnt: 222222,
        tokens_burnt: "231549875456",
      },
      predecessor_id: "signer2.test",
      receipt_id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
      receiver_id: "receiver2.test",
    },
    receiptsOutcome: [
      {
        id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
        block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
        outcome: {
          logs: [],
          receipt_ids: [],
          status: {
            type: "failure",
            error: {
              type: "action",
              error: {
                type: "functionCallError",
                error: {
                  type: "executionError",
                  error: "Smart contract panicked: ERR_INCORRECT_NONCE",
                },
              },
            },
          },
          gas_burnt: 222222,
          tokens_burnt: "231549875456",
          executor_id: "signer.test",
          metadata: {
            version: 1,
            gas_profile: null,
          },
        },
        proof: [],
      },
    ],
    transactionOutcome: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
        status: { type: "successValue", value: "" },
        gas_burnt: 1111111,
        tokens_burnt: "12315657498754",
        executor_id: "signer.test",
        metadata: {
          version: 1,
          gas_profile: null,
        },
      },
      proof: [],
    },
  },
  //multi deposit with huge amount
  {
    hash: "222eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVxxx",
    signerId: "signer2.test",
    receiverId: "receiver2.test",
    status: "success",
    blockHash: "222BBBgnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
    blockTimestamp: +new Date(2019, 1, 1),
    actions: [
      {
        kind: "transfer",
        args: {
          deposit: "50000000000000000000",
        },
      },
      {
        kind: "transfer",
        args: {
          deposit: "90000000000000000000",
        },
      },
    ],
    receipt: {
      actions: [
        {
          kind: "transfer",
          args: {
            deposit: "33221122334455",
          },
        },
      ],
      block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
      outcome: {
        logs: ["LOG: Counter is now: 1"],
        outgoing_receipts: [],
        status: { type: "successValue", value: "" },
        gas_burnt: 123123123,
        tokens_burnt: "0",
      },
      predecessor_id: "signer2.test",
      receipt_id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
      receiver_id: "receiver2.test",
    },
    receiptsOutcome: [
      {
        id: "222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222",
        block_hash: "BvJeW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaVrrj",
        outcome: {
          logs: ["LOG: Counter is now: 1"],
          receipt_ids: [],
          status: { type: "successValue", value: "" },
          gas_burnt: 123123123,
          tokens_burnt: "0",
          executor_id: "signer.test",
          metadata: {
            version: 1,
            gas_profile: null,
          },
        },
        proof: [],
      },
    ],
    transactionOutcome: {
      id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
      block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
      outcome: {
        logs: [],
        receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
        status: { type: "successValue", value: "" },
        gas_burnt: 456456,
        tokens_burnt: "456456",
        executor_id: "signer.test",
        metadata: {
          version: 1,
          gas_profile: null,
        },
      },
      proof: [],
    },
  },
];

export const TRANSACTION_WITH_SUCCESSFUL_RECEIPT: TransactionOld = {
  hash: "T1111111111111111111111111111111111111111111",
  signerId: "signer.test",
  receiverId: "receiver.test",
  status: "success",
  blockHash: "B111111111111111111111111111111111111111111",
  blockTimestamp: +new Date(2019, 1, 1),
  actions: [
    {
      kind: "functionCall",
      args: {
        args: "eyJyZXF1ZXN0Ijp7ImxlZnQiOjMyNjI2Nzg5LCJyaWdodCI6MzIxMzIxMjl9LCJyZXNwb25zZSI6IlNraXBwZWQifQ==",
        deposit: "0",
        gas: 100000000000000,
        methodName: "vote",
      },
    },
  ],
  receipt: {
    actions: [
      {
        kind: "functionCall",
        args: {
          args: "eyJyZXF1ZXN0Ijp7ImxlZnQiOjMyNjI2Nzg5LCJyaWdodCI6MzIxMzIxMjl9LCJyZXNwb25zZSI6IlNraXBwZWQifQ==",
          deposit: "0",
          gas: 100000000000000,
          methodName: "vote",
        },
      },
    ],
    block_hash: "B222222222222222222222222222222222222222222",
    outcome: {
      logs: [],
      outgoing_receipts: [
        {
          actions: [
            {
              kind: "transfer",
              args: {
                deposit: "18442482387744518207812",
              },
            },
          ],
          outcome: {
            logs: [],
            outgoing_receipts: [],
            status: { type: "successValue", value: "" },
            gas_burnt: 0,
            tokens_burnt: "0",
          },
          block_hash: "B333333333333333333333333333333333333333333",
          predecessor_id: "system",
          receipt_id: "R2222222222222222222222222222222222222222222",
          receiver_id: "receiver.test",
        },
      ],
      status: {
        type: "successValue",
        value: "eyJsZWZ0IjoyOTY0NzI2OCwicmlnaHQiOjIyMDE2MDA4fQ==",
      },
      gas_burnt: 6121577723732,
      tokens_burnt: "612157772373200000000",
    },
    predecessor_id: "signer.test",
    receipt_id: "R1111111111111111111111111111111111111111111",
    receiver_id: "receiver.test",
  },
  receiptsOutcome: [],
  transactionOutcome: {
    id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
    block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
    outcome: {
      logs: [],
      receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
      status: { type: "successValue", value: "" },
      gas_burnt: 456456,
      tokens_burnt: "456456",
      executor_id: "signer.test",
      metadata: {
        version: 1,
        gas_profile: null,
      },
    },
    proof: [],
  },
};

export const TRANSACTION_WITH_MANY_RECEIPTS: TransactionOld = {
  hash: "T1111111111111111111111111111111111111111111",
  signerId: "signer.test",
  receiverId: "receiver.test",
  status: "success",
  blockHash: "B111111111111111111111111111111111111111111",
  blockTimestamp: +new Date(2019, 1, 1),
  actions: [
    {
      kind: "functionCall",
      args: {
        args: "eyJyZWNlaXZlcl9pZCI6ImZhcm0uYmVycnljbHViLmVrLm5lYXIiLCJhbW91bnQiOiI5ODA3MjI5NDczMjEyNzA2MDI4IiwibWVtbyI6IlN3YXBwaW5nIDk4MDcyMjk0NzMyMTI3MDYwMjgg8J+NjCB0byBnZXQgOTgwNzIyOTQ3MzIxMjcwNjAyOCDwn6WSIiwibXNnIjoiXCJEZXBvc2l0QW5kU3Rha2VcIiJ9",
        deposit: "1",
        gas: 50000000000000,
        methodName: "ft_transfer_call",
      },
    },
  ],
  receipt: {
    actions: [
      {
        kind: "functionCall",
        args: {
          args: "eyJyZWNlaXZlcl9pZCI6ImZhcm0uYmVycnljbHViLmVrLm5lYXIiLCJhbW91bnQiOiI5ODA3MjI5NDczMjEyNzA2MDI4IiwibWVtbyI6IlN3YXBwaW5nIDk4MDcyMjk0NzMyMTI3MDYwMjgg8J+NjCB0byBnZXQgOTgwNzIyOTQ3MzIxMjcwNjAyOCDwn6WSIiwibXNnIjoiXCJEZXBvc2l0QW5kU3Rha2VcIiJ9",
          deposit: "1",
          gas: 50000000000000,
          methodName: "ft_transfer_call",
        },
      },
    ],
    block_hash: "B222222222222222222222222222222222222222222",
    outcome: {
      logs: [
        "Transfer 9807229473212706028 from signer.test to receiver.test",
        "Memo: Swapping 9807229473212706028 🍌 to get 9807229473212706028 🥒",
      ],
      outgoing_receipts: [
        {
          actions: [
            {
              kind: "functionCall",
              args: {
                args: "eyJzZW5kZXJfaWQiOiJsZW9uYXJkd2NhaS5uZWFyIiwiYW1vdW50IjoiOTgwNzIyOTQ3MzIxMjcwNjAyOCIsIm1zZyI6IlwiRGVwb3NpdEFuZFN0YWtlXCIifQ==",
                deposit: "0",
                gas: 20000000000000,
                methodName: "ft_on_transfer",
              },
            },
          ],
          outcome: {
            logs: [],
            status: { type: "successValue", value: "IjAi" },
            outgoing_receipts: [
              {
                actions: [
                  {
                    kind: "transfer",
                    args: { deposit: "2692703989595008561160" },
                  },
                ],
                outcome: {
                  logs: [],
                  outgoing_receipts: [],
                  status: { type: "successValue", value: "" },
                  gas_burnt: 0,
                  tokens_burnt: "0",
                },
                block_hash: "B444444444444444444444444444444444444444444",
                predecessor_id: "system",
                receipt_id: "R555555555555555555555555555555555555555555",
                receiver_id: "receiver.test",
              },
            ],
            gas_burnt: 4118773191051,
            tokens_burnt: "411877319105100000000",
          },
          block_hash: "B333333333333333333333333333333333333333333",
          predecessor_id: "signer1.test",
          receipt_id: "R222222222222222222222222222222222222222222",
          receiver_id: "receiver.test",
        },
        {
          actions: [
            {
              kind: "functionCall",
              args: {
                args: "eyJzZW5kZXJfaWQiOiJsZW9uYXJkd2NhaS5uZWFyIiwicmVjZWl2ZXJfaWQiOiJmYXJtLmJlcnJ5Y2x1Yi5lay5uZWFyIiwiYW1vdW50IjoiOTgwNzIyOTQ3MzIxMjcwNjAyOCJ9",
                deposit: "0",
                gas: 5000000000000,
                methodName: "ft_resolve_transfer",
              },
            },
          ],
          block_hash: "B4444444444444444444444444444444444444444444",
          outcome: {
            logs: [],
            outgoing_receipts: [
              {
                actions: [
                  {
                    kind: "transfer",
                    args: {
                      deposit: "676054406414262551432",
                    },
                  },
                ],
                block_hash: "B666666666666666666666666666666666666666666",
                outcome: {
                  logs: [],
                  outgoing_receipts: [],
                  status: { type: "successValue", value: "" },
                  gas_burnt: 0,
                  tokens_burnt: "0",
                },
                predecessor_id: "system",
                receipt_id: "R6666666666666666666666666666666666666666666",
                receiver_id: "receiver.test",
              },
            ],
            status: {
              type: "successValue",
              value: "Ijk4MDcyMjk0NzMyMTI3MDYwMjgi",
            },
            gas_burnt: 3521810343748,
            tokens_burnt: "352181034374800000000",
          },
          predecessor_id: "signer1.test",
          receipt_id: "R3333333333333333333333333333333333333333333",
          receiver_id: "receiver1.test",
        },
        {
          actions: [
            {
              kind: "transfer",
              args: {
                deposit: "1036800717074305521888",
              },
            },
          ],
          block_hash: "B555555555555555555555555555555555555555555",
          outcome: {
            logs: [],
            outgoing_receipts: [],
            status: { type: "successValue", value: "" },
            gas_burnt: 0,
            tokens_burnt: "0",
          },
          predecessor_id: "system",
          receipt_id: "R4444444444444444444444444444444444444444444",
          receiver_id: "receiver.test",
        },
      ],
      status: {
        type: "successReceiptId",
        receiptId: "R3333333333333333333333333333333333333333333",
      },
      gas_burnt: 20876917901092,
      tokens_burnt: "2087691790109200000000",
    },
    predecessor_id: "signer.test",
    receipt_id: "R1111111111111111111111111111111111111111111",
    receiver_id: "receiver.test",
  },
  receiptsOutcome: [],
  transactionOutcome: {
    id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
    block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
    outcome: {
      logs: [],
      receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
      status: { type: "successValue", value: "" },
      gas_burnt: 456456,
      tokens_burnt: "456456",
      executor_id: "signer.test",
      metadata: {
        version: 1,
        gas_profile: null,
      },
    },
    proof: [],
  },
};

export const TRANSACTION_WITH_FAILING_RECEIPT: TransactionOld = {
  hash: "T1111111111111111111111111111111111111111111",
  signerId: "signer.test",
  receiverId: "receiver.test",
  status: "failure",
  blockHash: "B111111111111111111111111111111111111111111",
  blockTimestamp: +new Date(2019, 1, 1),
  actions: [
    {
      kind: "functionCall",
      args: {
        args: "eyJsaXN0aW5nX2lkIjoiMDAwMDI4MDY2Iiwic2VsbGVyX3RyYW5zYWN0aW9uX2lkIjoidHJfMUlXRDNTQndhdnpjM0NqemxiNVpNa1BrIn0=",
        deposit: "0",
        gas: 30000000000000,
        methodName: "set_listing_seller_transaction_id",
      },
    },
  ],
  receipt: {
    actions: [
      {
        kind: "functionCall",
        args: {
          args: "eyJsaXN0aW5nX2lkIjoiMDAwMDI4MDY2Iiwic2VsbGVyX3RyYW5zYWN0aW9uX2lkIjoidHJfMUlXRDNTQndhdnpjM0NqemxiNVpNa1BrIn0=",
          deposit: "0",
          gas: 30000000000000,
          methodName: "set_listing_seller_transaction_id",
        },
      },
    ],
    block_hash: "B111111111111111111111111111111111111111111",
    outcome: {
      logs: ["000028066 listings not found"],
      outgoing_receipts: [
        {
          actions: [
            {
              kind: "transfer",
              args: {
                deposit: "3534039811405759434660",
              },
            },
          ],
          outcome: {
            logs: [],
            outgoing_receipts: [],
            status: { type: "successValue", value: "" },
            gas_burnt: 0,
            tokens_burnt: "0",
          },
          block_hash: "B222222222222222222222222222222222222222222",
          predecessor_id: "system",
          receipt_id: "R2222222222222222222222222222222222222222222",
          receiver_id: "receiver.test",
        },
      ],
      status: {
        type: "failure",
        error: {
          type: "action",
          error: {
            type: "functionCallError",
            error: {
              type: "hostError",
            },
          },
        },
      },
      gas_burnt: 3380537230112,
      tokens_burnt: "338053723011200000000",
    },
    predecessor_id: "signer.test",
    receipt_id: "R1111111111111111111111111111111111111111111",
    receiver_id: "receiver.test",
  },
  receiptsOutcome: [],
  transactionOutcome: {
    id: "9uZxS2cuZv7yphcidRiwNqDayMxcVRE1zHkAmwrHr1vs",
    block_hash: "000eW6gnFjkCBKCsRNEBrRLDQCFZNxLAi6uXzmLaV000",
    outcome: {
      logs: [],
      receipt_ids: ["222aLh5pzaeuiq4VVnmgghT6RzCRuiNftkJCZmVQv222"],
      status: { type: "successValue", value: "" },
      gas_burnt: 456456,
      tokens_burnt: "456456",
      executor_id: "signer.test",
      metadata: {
        version: 1,
        gas_profile: null,
      },
    },
    proof: [],
  },
};

export const RECEIPTS: Receipt[] = [
  {
    actions: [
      { args: { deposit: "8403180157952936387200" }, kind: "transfer" },
    ],
    blockTimestamp: 1621931941926,
    gasBurnt: "0",
    receiptId: "D6a85wNQ47v3dPy8bGF2WQpKQu5di2dnx4EMohm9f5fc",
    receiverId: "ig27.near",
    signerId: "system",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "0",
  },
  {
    actions: [
      {
        args: {
          gas: 25000000000000,
          deposit: "0",
          args: "eyJhbW91bnQiOiIxNzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIifQ==",
          methodName: "on_staking_pool_withdraw",
        },
        kind: "functionCall",
      },
    ],
    blockTimestamp: 1621931942764,
    gasBurnt: "3398892960118",
    receiptId: "BvG4qfnrxVfpqXrSgxxnfdrHYTKFjTcf2LtgEeX5Mzyz",
    receiverId: "5ce78003b590264df3f259983f3c3e0917fc10ea.lockup.near",
    signerId: "5ce78003b590264df3f259983f3c3e0917fc10ea.lockup.near",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "339889296011800000000",
  },
  {
    actions: [
      {
        args: {
          gas: 75000000000000,
          deposit: "0",
          args: "eyJhbW91bnQiOiIxNzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIifQ==",
          methodName: "withdraw",
        },
        kind: "functionCall",
      },
    ],
    blockTimestamp: 1621931941926,
    gasBurnt: "5461623809433",
    receiptId: "A7imDWVu3jS5J86nc7VauS947kTyjgVSmYsu29YgBCSN",
    receiverId: "bisontrails.poolv1.near",
    signerId: "5ce78003b590264df3f259983f3c3e0917fc10ea.lockup.near",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "546162380943300000000",
  },
  {
    actions: [
      {
        args: { deposit: "60566073914760117389740" },
        kind: "transfer",
      },
    ],
    blockTimestamp: 1621931941926,
    gasBurnt: "0",
    receiptId: "FiT82ZetgfvM4de3pte9f9WL4jrFtVjttYW9KL4Erj2b",
    receiverId: "wbc992.near",
    signerId: "system",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "0",
  },
  {
    actions: [
      {
        args: {
          gas: 20000000000000,
          deposit: "0",
          args: "eyJwcmVkZWNlc3Nvcl9hY2NvdW50X2lkIjoid2JjOTkyLm5lYXIiLCJhbW91bnQiOiIxMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ==",
          methodName: "on_account_created",
        },
        kind: "functionCall",
      },
    ],
    blockTimestamp: 1621931942764,
    gasBurnt: "3247920255172",
    receiptId: "2idRLoceeRzRaFpjALFTgvBTuutQTqDRJajMMssVgLuB",
    receiverId: "near",
    signerId: "near",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "324792025517200000000",
  },
  {
    actions: [
      { args: {}, kind: "createAccount" },
      {
        args: {
          accessKey: {
            nonce: 0,
            permission: { type: "fullAccess" },
          },
          publicKey: "ed25519:8H5LgkRWx9gzFEL1VVmty2nLF15kaCpf1PqPveVepRwL",
        },
        kind: "addKey",
      },
      { args: { deposit: "110000000000000000000000" }, kind: "transfer" },
    ],
    blockTimestamp: 1621931941926,
    gasBurnt: "424555062500",
    receiptId: "GUswZE9PQijf7nrnjfNuWQXsYFjdr8vocqwxSuKt35Zx",
    receiverId: "rongyuejing.near",
    signerId: "near",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "42455506250000000000",
  },
  {
    actions: [
      { args: { deposit: "67402646702234962576368" }, kind: "transfer" },
    ],
    blockTimestamp: 1621931941926,
    gasBurnt: "0",
    receiptId: "Fv9EQm4HTFWyZBk4KDjMVbgoSLfoTPfhEkTL4f1sd6km",
    receiverId: "app.nearcrowd.near",
    signerId: "system",
    status: "successValue",
    originatedFromTransactionHash: "hash",
    tokensBurnt: "0",
  },
  {
    actions: [
      {
        args: {
          gas: 30000000000000,
          deposit: "0",
          args: "eyJ0YXNrX29yZGluYWwiOjAsInNvbHV0aW9uX2hhc2giOlsyMjQsMTMwLDk1LDk1LDI1Miw5LDY1LDE5LDIzOCw1NSwxMCwxMDYsMTE0LDQ2LDIxNCw0LDQzLDkwLDIzMywyMTIsMjI1LDExNCwxNTgsNDEsMjM5LDEzNCwxOTEsMTcyLDE0MiwxNDgsNTAsNzddfQ==",
          methodName: "submit_approved_solution",
        },
        kind: "functionCall",
      },
    ],
    blockTimestamp: 1621931941926,
    gasBurnt: "6048575020858",
    receiptId: "7uADRkZL3b8HRbCRe3ML6yRyVZ46HHp1pEJKbxewq5Hg",
    receiverId: "app.nearcrowd.near",
    signerId: "elonmusk_tesla.near",
    status: "successValue",
    originatedFromTransactionHash:
      "2WDYbcuRyyRXJvrXkfFej9Vrv3s3GNTxVQAqKFTiEtGh",
    tokensBurnt: "604857502085800000000",
  },
];
