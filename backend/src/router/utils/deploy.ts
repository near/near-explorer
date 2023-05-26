import { config } from "@/backend/config";
import { commonProcedure } from "@/backend/router/trpc";
import { getEnvironmentVariables } from "@/common/utils/environment";

export const procedure = commonProcedure.query(async () =>
  getEnvironmentVariables(`backend/${config.networkName}`)
);
