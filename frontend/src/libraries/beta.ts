import type { IncomingMessage } from "http";

import { getCookiesFromReq } from "@explorer/frontend/libraries/cookie";

export type BetaOptions =
  | {
      enabled: boolean;
    }
  | undefined;

export const BETA_COOKIE_NAME = "NEAR_BETA_OPTIONS";

const getBetaOptionsFromCookie = (cookie?: string): BetaOptions =>
  typeof cookie === "string" && cookie ? JSON.parse(cookie) : undefined;

export const getBetaOptionsFromReq = (req: IncomingMessage): BetaOptions =>
  getBetaOptionsFromCookie(getCookiesFromReq(req).get(BETA_COOKIE_NAME));
