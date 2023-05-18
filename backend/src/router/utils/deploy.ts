import * as trpc from "@trpc/server";

import { config } from "@/backend/config";
import { RequestContext } from "@/backend/context";
import { getEnvironmentVariables } from "@/common/utils/environment";

export const router = trpc.router<RequestContext>().query("deployInfo", {
  resolve: async () => getEnvironmentVariables(`backend/${config.networkName}`),
});
