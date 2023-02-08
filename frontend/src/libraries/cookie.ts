import React from "react";

import type { IncomingMessage } from "http";
import Cookies from "universal-cookie";

export const CookieContext = React.createContext<Cookies>(new Cookies());

export const getCookiesFromString = (cookies: string) => new Cookies(cookies);

export const getCookiesFromReq = (req: IncomingMessage): Cookies =>
  getCookiesFromString(req.headers.cookie ?? "");
