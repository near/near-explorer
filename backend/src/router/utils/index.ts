import { t } from "@/backend/router/trpc";

import { procedure as deployInfo } from "./deploy";
import { procedure as protocolVersion } from "./protocol";
import { procedure as search } from "./search";
import { procedure as subscriptionsCache } from "./subscriptions";

export const router = t.router({
  protocolVersion,
  deployInfo,
  search,
  subscriptionsCache,
});
