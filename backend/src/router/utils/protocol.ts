import { t } from "@/backend/router/trpc";
import * as nearApi from "@/backend/utils/near";

export const procedure = t.procedure.query(async () => {
  const result = await nearApi.sendJsonRpc("status", [null]);
  return result.protocol_version;
});
