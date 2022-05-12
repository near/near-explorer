import InfiniteScroll from "react-infinite-scroll-component";

import * as React from "react";
import * as ReactQuery from "react-query";

import PaginationSpinner from "./PaginationSpinner";
import Update from "./Update";

import { useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import { Fetcher } from "../../libraries/transport";
import { useFetcher } from "../../hooks/use-fetcher";
import { styled } from "../../libraries/styles";

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

export type StaticConfig<T, I> = {
  key: string;
  Component: React.FC<{ items: T[] }>;
  paginationIndexer: ReactQuery.GetNextPageParamFunction<T[]>;
  hasUpdateButton?: boolean;
  fetch: (fetcher: Fetcher, indexer: I | undefined) => Promise<T[]>;
};

type UpdateBlockHeightProps = {
  onClick: () => void;
};

const UpdateBlockHeight: React.FC<UpdateBlockHeightProps> = React.memo(
  (props) => {
    const { t } = useTranslation();
    const latestBlockHeight = useLatestBlockHeight();
    return (
      <div onClick={props.onClick}>
        <Update>{`${t(
          "utils.ListHandler.last_block"
        )}#${latestBlockHeight}.`}</Update>
      </div>
    );
  }
);

const Wrapper = <T, I>(config: StaticConfig<T, I>): React.FC => {
  return React.memo(() => {
    const { t } = useTranslation();
    const fetcher = useFetcher();

    const queryClient = ReactQuery.useQueryClient();
    const key = ["list", config.key];

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      refetch,
    } = ReactQuery.useInfiniteQuery(
      key,
      ({
        pageParam,
      }: ReactQuery.QueryFunctionContext<ReactQuery.QueryKey, I>) =>
        config.fetch(fetcher, pageParam),
      {
        getNextPageParam: config.paginationIndexer,
      }
    );
    const allItems =
      data?.pages.reduce((acc, page) => [...acc, ...page], []) ?? [];
    const fetchMore = React.useCallback(() => fetchNextPage(), [fetchNextPage]);

    const refetchAll = React.useCallback(() => {
      queryClient.setQueryData(key, undefined);
      refetch();
    }, [key, queryClient, refetch]);

    if (isFetching && !isFetchingNextPage) {
      return <PaginationSpinner />;
    }
    return (
      <>
        {config.hasUpdateButton ? (
          <UpdateBlockHeight onClick={refetchAll} />
        ) : null}
        <InfiniteScroll
          dataLength={allItems.length}
          next={fetchMore}
          hasMore={hasNextPage ?? true}
          loader={
            isFetchingNextPage ? (
              <PaginationSpinner />
            ) : (
              <LoadButton onClick={fetchMore} visible={hasNextPage}>
                {t("button.load_more")}
              </LoadButton>
            )
          }
          style={{ overflowX: "hidden" }}
        >
          <config.Component items={allItems} />
        </InfiniteScroll>
      </>
    );
  });
};

export default Wrapper;
