import * as trpc from "@trpc/server";
import { z, ZodType } from "zod";

import { Context } from "../../context";
import { validators } from "../validators";
import { indexerDatabase } from "../../database/databases";

const blockInput = z.union([
  z.preprocess((x) => Number(x), validators.blockHeight),
  validators.blockHash,
]);
const getBlockHash = async (blockId: z.infer<typeof blockInput>) => {
  let selection = indexerDatabase
    .selectFrom("blocks")
    .select("block_hash as hash");
  if (Number.isNaN(blockId)) {
    return;
  } else if (typeof blockId === "string") {
    selection = selection.where("block_hash", "=", blockId);
  } else {
    selection = selection.where("block_height", "=", blockId.toString());
  }
  const block = await selection.limit(1).executeTakeFirst();
  if (block) {
    return { blockHash: block.hash };
  }
};

const getTransactionHash = async (
  transactionHash: z.infer<typeof validators.transactionHash>
) => {
  const selection = await indexerDatabase
    .selectFrom("transactions")
    .select("transaction_hash as hash")
    .where("transaction_hash", "=", transactionHash)
    .limit(1)
    .executeTakeFirst();
  if (selection) {
    return { transactionHash: selection.hash };
  }
};

const getAccountId = async (input: z.infer<typeof validators.accountId>) => {
  const selection = await indexerDatabase
    .selectFrom("accounts")
    .where("account_id", "=", input)
    .select(["account_id as accountId"])
    .limit(1)
    .executeTakeFirst();
  if (selection) {
    return { accountId: selection.accountId };
  }
};

const getReceiptId = async (
  receiptId: z.infer<typeof validators.receiptId>
) => {
  const selection = await indexerDatabase
    .selectFrom("receipts")
    .select([
      "receipt_id as receiptId",
      "originated_from_transaction_hash as transactionHash",
    ])
    .where("receipt_id", "=", receiptId)
    .limit(1)
    .executeTakeFirst();
  if (selection) {
    return {
      transactionHash: selection.transactionHash,
      receiptId: selection.receiptId,
    };
  }
};

const validateAndFetch = async <T, V extends ZodType<any, any, any>>(
  input: string,
  validator: V,
  fetcher: (input: V["_type"]) => Promise<T>
): Promise<T | undefined> => {
  const result = validator.safeParse(input);
  if (!result.success) {
    throw new Error("Validation error");
  }
  const fetchedResult = await fetcher(result.data);
  if (!fetchedResult) {
    throw new Error("Fetch error");
  }
  return fetchedResult;
};

export const router = trpc.router<Context>().query("search", {
  input: z.strictObject({
    value: z.string(),
  }),
  resolve: async ({ input: { value } }) =>
    Promise.any([
      validateAndFetch(value, blockInput, getBlockHash),
      validateAndFetch(value, validators.transactionHash, getTransactionHash),
      validateAndFetch(value, validators.accountId, getAccountId),
      validateAndFetch(value, validators.receiptId, getReceiptId),
    ]).catch(() => undefined),
});
