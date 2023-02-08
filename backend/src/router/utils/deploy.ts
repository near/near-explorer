import * as trpc from "@trpc/server";

import { Context } from "@explorer/backend/context";
import { getBranch, getShortCommitSha } from "@explorer/common/utils/git";
import { getEnvironment } from "@explorer/common/utils/environment";
import { config } from "@explorer/backend/config";

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
    } else {
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
    }
  },
});
