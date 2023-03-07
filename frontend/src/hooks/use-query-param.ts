import React from "react";

import { useRouter } from "next/router";

const extractParam = (
  queryParam: string | string[] | undefined
): string | undefined => {
  if (!queryParam) {
    return;
  }
  if (Array.isArray(queryParam)) {
    return queryParam[queryParam.length - 1];
  }
  return queryParam;
};

export const useQueryParam = (paramName: string) => {
  const router = useRouter();
  const currValue = extractParam(router.query[paramName]);
  const setValue = React.useCallback<
    React.Dispatch<React.SetStateAction<string | undefined>>
  >(
    (nextValueOrUpdater) => {
      const nextValue =
        typeof nextValueOrUpdater === "function"
          ? nextValueOrUpdater(currValue)
          : nextValueOrUpdater;
      const nextQuery = { ...router.query, [paramName]: nextValue };
      if (!nextQuery[paramName]) {
        delete nextQuery[paramName];
      }
      router.replace({ query: nextQuery }, undefined, { shallow: true });
    },
    [currValue, paramName, router]
  );
  return [currValue, setValue] as const;
};
