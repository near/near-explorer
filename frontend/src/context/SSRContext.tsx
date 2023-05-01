import * as React from "react";

export interface SSRContextType {
  // Without this timestamp server will render "1 second ago" and client will render "2 seconds ago"
  // which will cause hydration mismatch warning
  nowTimestamp: number;
  tzOffset: number;
  isFirstRender: boolean;
}

export const SSRContext = React.createContext<SSRContextType>({
  nowTimestamp: Date.now(),
  tzOffset: new Date().getTimezoneOffset(),
  isFirstRender: true,
});
