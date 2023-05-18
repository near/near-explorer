import * as trpc from "@trpc/server";

import { RequestContext } from "@/backend/context";
import * as nearApi from "@/backend/utils/near";

export const router = trpc.router<RequestContext>().query("protocolVersion", {
  resolve: async () => {
    const result = await nearApi.sendJsonRpc("status", [null]);
    return result.protocol_version;
  },
});
