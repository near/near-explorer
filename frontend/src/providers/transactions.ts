import BN from "bn.js";
import { TransactionHash } from "../types/nominal";
import { failed, QueryConfiguration, successful } from "../libraries/queries";
import { Action, RPC } from "../libraries/wamp/types";
import { WampCall } from "../libraries/wamp/api";

import {
  Transaction,
  TransactionError,
  TransactionErrorResponse,
} from "../types/transaction";

export const transactionByHashQuery: QueryConfiguration<
  TransactionHash,
  Transaction | null,
  TransactionErrorResponse
> = {
  getKey: (hash) => ["transaction", hash],
  fetchData: async (hash, wampCall) =>
    successful(await getTransaction(wampCall, hash)),
  onError: async (e) =>
    failed({
      error: TransactionError.Internal,
      details:
        typeof e === "object" && e && "toString" in e
          ? e.toString()
          : String(e),
    }),
};

const mapRpcActionToAction = (action: RPC.ActionView): Action => {
  if (action === "CreateAccount") {
    return {
      kind: "CreateAccount",
      args: {},
    };
  }
  const kind = Object.keys(action)[0] as keyof Exclude<
    RPC.ActionView,
    "CreateAccount"
  >;
  return {
    kind,
    args: action[kind],
  } as Action;
};

const getDeposit = (actions: any[]) =>
  actions
    .map((action: Action) => {
      if ("deposit" in action.args) {
        return new BN(action.args.deposit);
      } else {
        return new BN(0);
      }
    })
    .reduce(
      (accumulator: BN, deposit: BN) => accumulator.add(deposit),
      new BN(0)
    )
    .toString() as string;

const getTransaction = async (
  wampCall: WampCall,
  hash: TransactionHash
): Promise<Transaction | null> => {
  try {
    const wampCallTransaction = await wampCall("transaction", [hash]);
    const {
      hash: transactionHash,
      created,
      transactionIndex,
      status,
      transaction,
      transactionOutcome,
      receipts,
      receiptsOutcome,
    } = wampCallTransaction;

    const txActions = transaction.actions?.map(mapRpcActionToAction);

    if (
      receipts.length === 0 ||
      receipts[0].receipt_id !== receiptsOutcome[0].id
    ) {
      receipts.unshift({
        predecessor_id: transaction.signer_id,
        receipt: {
          Action: {
            signer_id: transaction.signer_id,
            signer_public_key: "",
            gas_price: "0",
            output_data_receivers: [],
            input_data_ids: [],
            actions: transaction.actions,
          },
        },
        receipt_id: receiptsOutcome[0].id,
        receiver_id: transaction.receiver_id,
      });
    }

    const receiptOutcomesByIdMap = receiptsOutcome.reduce(
      (
        acc: Map<string, RPC.ExecutionOutcomeWithIdView>,
        receipt: RPC.ExecutionOutcomeWithIdView
      ) => {
        acc.set(receipt.id, receipt);
        return acc;
      },
      new Map()
    ) as Map<string, RPC.ExecutionOutcomeWithIdView>;

    const receiptsByIdMap = receipts.reduce(
      (
        acc: Map<
          string,
          Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
        >,
        receiptItem: Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
      ) => {
        acc.set(receiptItem.receipt_id, {
          ...receiptItem,
          actions:
            "Action" in receiptItem.receipt
              ? receiptItem.receipt.Action.actions.map(mapRpcActionToAction)
              : [],
        });
        return acc;
      },
      new Map()
    ) as Map<string, Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }>;

    const receiptsMap = new Map();

    const collectNestedReceiptWithOutcome = (
      receiptHash: string,
      parentReceiptHash: string | null = null
    ): any => {
      const receipt = receiptsByIdMap.get(receiptHash);
      const receiptOutcome = receiptOutcomesByIdMap.get(receiptHash);

      const _receipt = {
        actions: receipt?.actions,
        deposit: getDeposit(receipt?.actions ?? []),
        signerId: receipt?.predecessor_id, // do we need to rename 'signerId' to 'predecessor_id'?
        parentReceiptHash,
      };

      const outcome = {
        includedInBlockHash: receiptOutcome?.block_hash, // executed in block
        receiptId: receiptOutcome?.id,
        receiverId: receiptOutcome?.outcome.executor_id,
        gasBurnt: receiptOutcome?.outcome.gas_burnt,
        tokensBurnt: receiptOutcome?.outcome.tokens_burnt,
        logs: receiptOutcome?.outcome.logs,
        status: receiptOutcome?.outcome.status,
      };

      receiptsMap.set(receiptHash, {
        ..._receipt,
        ...outcome,
      });

      return {
        ...receipt,
        ...receiptOutcome,
        outcome: {
          ...receiptOutcome?.outcome,
          outgoing_receipts: receiptOutcome?.outcome.receipt_ids.map(
            (executedReceipt: string) =>
              collectNestedReceiptWithOutcome(executedReceipt, receiptHash)
          ),
        },
      };
    };

    const _gasBurntByTx = transactionOutcome
      ? new BN(transactionOutcome.outcome.gas_burnt)
      : new BN(0);
    const _gasBurntByReceipts = receiptsOutcome
      ? receiptsOutcome
          .map(
            (receipt: RPC.ExecutionOutcomeWithIdView) =>
              new BN(receipt.outcome.gas_burnt)
          )
          .reduce(
            (gasBurnt: BN, currentFee: BN) => gasBurnt.add(currentFee),
            new BN(0)
          )
      : new BN(0);
    const gasUsed = _gasBurntByTx.add(_gasBurntByReceipts).toString() as string;

    const _actionArgs = txActions.map((action: Action) => action.args);
    const _gasAttachedArgs = _actionArgs.filter((args: any) => "gas" in args);
    const gasAttached =
      _gasAttachedArgs.length === 0
        ? gasUsed
        : (_gasAttachedArgs
            .reduce(
              (accumulator: BN, args: any) =>
                accumulator.add(new BN(args.gas.toString())),
              new BN(0)
            )
            .toString() as string);

    const _tokensBurntByTx = transactionOutcome
      ? new BN(transactionOutcome.outcome.tokens_burnt)
      : new BN(0);
    const _tokensBurntByReceipts = receiptsOutcome
      ? receiptsOutcome
          .map(
            (receipt: RPC.ExecutionOutcomeWithIdView) =>
              new BN(receipt.outcome.tokens_burnt)
          )
          .reduce(
            (tokenBurnt: BN, currentFee: BN) => tokenBurnt.add(currentFee),
            new BN(0)
          )
      : new BN(0);
    const transactionFee = _tokensBurntByTx
      .add(_tokensBurntByReceipts)
      .toString() as string;

    collectNestedReceiptWithOutcome(receiptsOutcome[0].id);
    const receiptsToValues = [...receiptsMap.values()];

    receiptsToValues.forEach((receipt) => {
      const parentReceipt = receiptsMap.get(receipt.parentReceiptHash);
      if (receipt.signerId === "system" && parentReceipt) {
        receiptsMap.set(receipt.parentReceiptHash, {
          ...parentReceipt,
          refunded: getDeposit(receipt.actions),
        });
        receiptsMap.delete(receipt.receiptId);
      }
    });

    const response = {
      hash: transactionHash,
      created,
      transaction,
      transactionIndex,
      transactionFee,
      transactionOutcome,
      status,
      gasUsed,
      gasAttached,
      receipts: [...receiptsMap.values()],
    };

    return response;
  } catch (e) {
    throw {
      error: TransactionError.Internal,
      details: e,
    };
  }
};
