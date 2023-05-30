import { initTRPC } from "@trpc/server";

import { RequestContext } from "@/backend/context";
import { getEnvironment } from "@/common/utils/environment";

export const t = initTRPC.context<RequestContext>().create({
  // Stripping out the stack on production environment
  errorFormatter: ({ shape }) =>
    getEnvironment() === "prod"
      ? {
          ...shape,
          data: { ...shape.data, stack: undefined },
        }
      : shape,
});

export const commonProcedure = t.procedure;
