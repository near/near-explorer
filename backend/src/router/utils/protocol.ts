import { commonProcedure } from "@/backend/router/trpc";
import * as nearApi from "@/backend/utils/near";

export const procedure = commonProcedure.query(async () => {
  const result = await nearApi.sendJsonRpc("status", [null]);
  return result.protocol_version;
});
