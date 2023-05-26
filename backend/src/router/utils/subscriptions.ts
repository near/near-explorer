import { commonProcedure } from "@/backend/router/trpc";

export const procedure = commonProcedure.query(
  ({ ctx }) => ctx.subscriptionsCache
);
