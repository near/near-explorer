import * as trpc from "@trpc/server";

import { RequestContext } from "@explorer/backend/context";
import * as nearApi from "@explorer/backend/utils/near";

export const router = trpc.router<RequestContext>().query("protocolVersion", {
  resolve: async () => {
    const result = await nearApi.sendJsonRpc("status", [null]);
    return result.protocol_version;
  },
});
