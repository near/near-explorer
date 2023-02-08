import InfiniteScroll from "react-infinite-scroll-component";

import * as React from "react";
import * as ReactQuery from "react-query";

import PaginationSpinner from "@explorer/frontend/components/utils/PaginationSpinner";

import { useTranslation } from "react-i18next";
import { styled } from "@explorer/frontend/libraries/styles";

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

export type Props<T, R = T[]> = {
  query: ReactQuery.UseInfiniteQueryResult<R, unknown>;
  parser: (input: R) => T[];
  children: (items: T[]) => React.ReactNode;
  prependChildren?: React.ReactNode;
};

const ListHandler = <T, R = T[]>({
  query,
  parser,
  children,
  prependChildren,
}: Props<T, R>) => {
  const { t } = useTranslation();
  const allItems =
    query.data?.pages.reduce<T[]>(
      (acc, page) => [...acc, ...parser(page)],
      []
    ) ?? [];
  const fetchMore = React.useCallback(
    () => query.fetchNextPage(),
    [query.fetchNextPage]
  );

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
};

export default ListHandler;
