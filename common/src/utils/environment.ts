import { set, camelCase } from "lodash";

import { getBranch, getShortCommitSha } from "@/common/utils/git";

const GROUP_DELIMITER = "__";

const safeParse = (input?: string): unknown => {
  try {
    return JSON.parse(input || "");
  } catch {
    return input;
  }
};

export const getOverrides = <T extends Partial<Record<string, unknown>>>(
  prefix: string
): T => {
  const overrides = {} as T;
  const prefixWithDelimiter = prefix + GROUP_DELIMITER;
  Object.entries(process.env).forEach(([name, value]) => {
    if (!name.startsWith(prefixWithDelimiter)) {
      return;
    }
    set(
      overrides,
      name
        .slice(prefixWithDelimiter.length)
        .split(GROUP_DELIMITER)
        .map(camelCase),
      safeParse(value)
    );
  });
  return overrides;
};

export type Environment = "prod" | "dev" | "staging";

export const getEnvironment = (): Environment => {
  if (process.env.RENDER && process.env.RENDER_SERVICE_ID) {
    return process.env.RENDER_SERVICE_ID.includes("pr") ? "staging" : "prod";
  }
  if (process.env.GCP) {
    if (process.env.BRANCH) {
      return process.env.BRANCH.includes("merge") ? "staging" : "prod";
    }
    // Temporary solution as production doesn't have BRANCH env variable yet
    return "prod";
  }
  return "dev";
};

type EnvironmentVariables = {
  environment: Environment;
  branch: string;
  commit: string;
  // frontend / backend-mainnet / backend-testnet
  serviceName: string;
  // production / pr-xxx
  revisionId: string;
  // vm-1 / vm-2
  instanceId: string;
};

export const getEnvironmentStaticVariables = (
  localServiceName: string
): Omit<EnvironmentVariables, "branch" | "commit"> => {
  if (process.env.RENDER || process.env.GCP) {
    const environment = getEnvironment();
    if (process.env.RENDER) {
      return {
        serviceName: process.env.RENDER_SERVICE_NAME || "unknown",
        revisionId: process.env.RENDER_SERVICE_ID || "unknown",
        instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
        environment,
      };
    }
    if (process.env.GCP) {
      return {
        serviceName: process.env.K_SERVICE || "unknown",
        revisionId: process.env.K_REVISION || "unknown",
        instanceId: "unavailable",
        environment,
      };
    }
  }
  return {
    serviceName: localServiceName,
    revisionId: "local",
    instanceId: "local",
    environment: "dev",
  };
};

export const getEnvironmentVariables = async (
  localServiceName: string
): Promise<EnvironmentVariables> => {
  const staticVaiables = getEnvironmentStaticVariables(localServiceName);
  if (process.env.RENDER || process.env.GCP) {
    if (process.env.RENDER) {
      return {
        ...staticVaiables,
        branch: process.env.RENDER_GIT_BRANCH || "unknown",
        commit: process.env.RENDER_GIT_COMMIT || "unknown",
      };
    }
    if (process.env.GCP) {
      return {
        ...staticVaiables,
        branch: process.env.BRANCH || "unknown",
        commit: process.env.COMMIT_SHA || "unknown",
      };
    }
  }
  const [branch, commit] = await Promise.all([
    getBranch(),
    getShortCommitSha(),
  ]);
  return {
    ...staticVaiables,
    branch,
    commit,
  };
};
