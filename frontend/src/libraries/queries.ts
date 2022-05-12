import React from "react";
import * as ReactQuery from "react-query";

export const createQueryClient = () =>
  new ReactQuery.QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

export const useClientQueryClient = (): ReactQuery.QueryClient => {
  return React.useState(createQueryClient)[0];
};
