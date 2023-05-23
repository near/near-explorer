import { t } from "@/backend/router/trpc";

import { procedure as byId } from "./by-id";
import { procedure as final } from "./final";
import { procedure as list } from "./list";

export const router = t.router({
  byId,
  list,
  final,
});
