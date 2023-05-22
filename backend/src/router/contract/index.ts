import { t } from "@/backend/router/trpc";

import { procedure as byId } from "./by-id";

export const router = t.router({ byId });
