import * as trpc from "@trpc/server";

import { config } from "@explorer/backend/config";
import { Context } from "@explorer/backend/context";
import { getEnvironment } from "@explorer/common/utils/environment";
import { getBranch, getShortCommitSha } from "@explorer/common/utils/git";

export const router = trpc.router<Context>().query("deployInfo", {
  resolve: async () => {
    if (process.env.RENDER) {
      return {
        branch: process.env.RENDER_GIT_BRANCH || "unknown",
        commit: process.env.RENDER_GIT_COMMIT || "unknown",
        instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
        serviceId: process.env.RENDER_SERVICE_ID || "unknown",
        serviceName: process.env.RENDER_SERVICE_NAME || "unknown",
        environment: getEnvironment(),
      };
    }
    const [branch, commit] = await Promise.all([
      getBranch(),
      getShortCommitSha(),
    ]);
    return {
      branch,
      commit,
      instanceId: "local",
      serviceId: "local",
      serviceName: `backend/${config.networkName}`,
      environment: "dev" as const,
    };
  },
});
