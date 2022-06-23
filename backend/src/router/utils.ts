import * as trpc from "@trpc/server";

import { Context } from "../context";
import { getBranch, getShortCommitSha } from "../common";
import * as nearApi from "../utils/near";
import { config } from "../config";

export const router = trpc
  .router<Context>()
  .query("nearcore-status", {
    resolve: () => {
      return nearApi.sendJsonRpc("status", [null]);
    },
  })
  .query("deploy-info", {
    resolve: async () => {
      if (process.env.RENDER) {
        return {
          branch: process.env.RENDER_GIT_BRANCH || "unknown",
          commit: process.env.RENDER_GIT_COMMIT || "unknown",
          instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
          serviceId: process.env.RENDER_SERVICE_ID || "unknown",
          serviceName: process.env.RENDER_SERVICE_NAME || "unknown",
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
        };
      }
    },
  });
