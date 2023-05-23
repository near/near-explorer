import { t } from "@/backend/router/trpc";

export const procedure = t.procedure.query(({ ctx }) => ctx.subscriptionsCache);
