import * as React from "react";

import { useIntersectionObserver } from "@react-hookz/web";
import { useTranslation } from "next-i18next";

import { Unpacked } from "@/common/types/common";
import {
  TRPCInfiniteQueryKey,
  TRPCInfiniteQueryOutput,
  TRPCInfiniteQueryResult,
} from "@/common/types/trpc";
import { ErrorMessage } from "@/frontend/components/utils/ErrorMessage";
import { PaginationSpinner } from "@/frontend/components/utils/PaginationSpinner";
import { typedMemo } from "@/frontend/libraries/react";
import { styled } from "@/frontend/libraries/styles";

const LoadButton = styled("button", {
  width: 100,
  backgroundColor: "#f8f8f8",
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  fontSize: 14,
  color: "#0072ce",
  fontWeight: "bold",
  textTransform: "uppercase",
  margin: "20px auto",
  borderRadius: 30,
  padding: "8px 0",
  cursor: "pointer",
  border: "none",

  variants: {
    visible: {
      false: {
        display: "none",
      },
    },
  },
});

export type Props<
  K extends TRPCInfiniteQueryKey,
  T = Unpacked<TRPCInfiniteQueryOutput<K>>
> = {
  query: TRPCInfiniteQueryResult<K>;
  parser: (input: TRPCInfiniteQueryOutput<K>) => T[];
  children: (items: T[]) => React.ReactNode;
};

export const ListHandler = typedMemo(
  <K extends TRPCInfiniteQueryKey, T = Unpacked<TRPCInfiniteQueryOutput<K>>>({
    query,
    parser,
    children,
  }: Props<K, T>) => {
    const { t } = useTranslation();
    const allItems =
      query.data?.pages.reduce<T[]>(
        (acc, page) => [...acc, ...parser(page)],
        []
      ) ?? [];
    const { fetchNextPage, hasNextPage, isFetching, isError } = query;
    const fetchNextPageNoParams = React.useCallback(
      () => fetchNextPage(),
      [fetchNextPage]
    );

    const waypointRef = React.useRef<HTMLDivElement>(null);
    const intersection = useIntersectionObserver(waypointRef.current);
    React.useEffect(() => {
      if (
        !intersection?.isIntersecting ||
        !hasNextPage ||
        isFetching ||
        isError
      ) {
        return;
      }
      fetchNextPage();
    }, [
      fetchNextPage,
      hasNextPage,
      isFetching,
      isError,
      intersection?.isIntersecting,
    ]);

    if (query.data) {
      return (
        <>
          {children(allItems)}
          <div ref={waypointRef} />
          {isFetching ? (
            <PaginationSpinner />
          ) : query.error ? (
            <ErrorMessage onRetry={fetchNextPageNoParams}>
              {query.error.message}
            </ErrorMessage>
          ) : (
            <LoadButton onClick={fetchNextPageNoParams} visible={hasNextPage}>
              {t("button.load_more")}
            </LoadButton>
          )}
        </>
      );
    }

    switch (query.status) {
      case "error":
        return (
          <ErrorMessage onRetry={fetchNextPageNoParams}>
            {query.error.message}
          </ErrorMessage>
        );
      case "loading":
        return <PaginationSpinner />;
    }
  }
);
