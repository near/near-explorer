import * as trpc from "@trpc/server";

import { config } from "@explorer/backend/config";
import { RequestContext } from "@explorer/backend/context";
import { getEnvironmentVariables } from "@explorer/common/utils/environment";

export const router = trpc.router<RequestContext>().query("deployInfo", {
  resolve: async () => getEnvironmentVariables(`backend/${config.networkName}`),
});
