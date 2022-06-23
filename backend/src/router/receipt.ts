import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as receipts from "../providers/receipts";
import { validators } from "./validators";

export const router = trpc
  .router<Context>()
  .query("included-receipts-list-by-block-hash", {
    input: z.tuple([validators.blockHash]),
    resolve: ({ input: [blockHash] }) => {
      return receipts.getIncludedReceiptsList(blockHash);
    },
  })
  .query("executed-receipts-list-by-block-hash", {
    input: z.tuple([validators.blockHash]),
    resolve: ({ input: [blockHash] }) => {
      return receipts.getExecutedReceiptsList(blockHash);
    },
  });
