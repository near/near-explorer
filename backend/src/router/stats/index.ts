import { t } from "@/backend/router/trpc";

import { procedure as latestCirculatingSupply } from "./circulating-supply";
import { procedure as tokensBurnt } from "./tokens-burnt";

export const router = t.router({
  latestCirculatingSupply,
  tokensBurnt,
});
