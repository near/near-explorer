import * as React from "react";

import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  TRPCInfiniteQueryKey,
  TRPCInfiniteQueryOutput,
  TRPCInfiniteQueryResult,
} from "@/common/types/trpc";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import PaginationSpinner from "@/frontend/components/utils/PaginationSpinner";
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

export type Props<K extends TRPCInfiniteQueryKey, T> = {
  query: TRPCInfiniteQueryResult<K>;
  parser: (input: TRPCInfiniteQueryOutput<K>) => T[];
  children: (items: T[]) => React.ReactNode;
  prependChildren?: React.ReactNode;
};

const ListHandler = typedMemo(
  <K extends TRPCInfiniteQueryKey, T>({
    query,
    parser,
    children,
    prependChildren,
  }: Props<K, T>) => {
    const { t } = useTranslation();
    const allItems =
      query.data?.pages.reduce<T[]>(
        (acc, page) => [...acc, ...parser(page)],
        []
      ) ?? [];
    const { fetchNextPage } = query;
    const fetchMore = React.useCallback(() => fetchNextPage(), [fetchNextPage]);

    if (query.error && !query.data) {
      return (
        <ErrorMessage onRetry={fetchMore}>{query.error.message}</ErrorMessage>
      );
    }
    if (query.isFetching && !query.isFetchingNextPage) {
      return <PaginationSpinner />;
    }
    return (
      <>
        {prependChildren}
        <InfiniteScroll
          dataLength={allItems.length}
          next={fetchMore}
          hasMore={query.hasNextPage ?? true}
          loader={
            query.isFetchingNextPage ? (
              <PaginationSpinner />
            ) : query.error ? (
              <ErrorMessage onRetry={fetchMore}>
                {query.error.message}
              </ErrorMessage>
            ) : (
              <LoadButton onClick={fetchMore} visible={query.hasNextPage}>
                {t("button.load_more")}
              </LoadButton>
            )
          }
          style={{ overflowX: "hidden" }}
        >
          {children(allItems)}
        </InfiniteScroll>
      </>
    );
  }
);

export default ListHandler;
