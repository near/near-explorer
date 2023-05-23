import { config } from "@/backend/config";
import { t } from "@/backend/router/trpc";
import { getEnvironmentVariables } from "@/common/utils/environment";

export const procedure = t.procedure.query(async () =>
  getEnvironmentVariables(`backend/${config.networkName}`)
);
