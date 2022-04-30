import InfiniteScroll from "react-infinite-scroll-component";

import * as React from "react";

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

interface StaticConfig<T, I> {
  Component: React.FC<{ items: T[] }>;
  category: string;
  paginationIndexer: (items: T[]) => I;
  hasUpdateButton?: boolean;
}

interface Props<T, I> {
  count: number;
  fetchDataFn: (
    fetcher: Fetcher,
    count: number,
    indexer: I | null
  ) => Promise<T[]>;
}

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

const Wrapper = <T, I>(config: StaticConfig<T, I>): React.FC<Props<T, I>> => {
  return React.memo((props) => {
    const { t } = useTranslation();
    const [items, setItems] = React.useState<T[]>([]);
    const [shouldShow, setShouldShow] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const fetcher = useFetcher();

    const fetch = React.useCallback(() => {
      setLoading(true);
      props
        .fetchDataFn(fetcher, props.count, null)
        .then((items) => {
          setItems(items);
          setHasMore(items.length >= props.count);
        })
        .catch((err: Error) => console.error(err))
        .then(() => {
          setLoading(false);
          setShouldShow(true);
        });
    }, [
      fetcher,
      props.fetchDataFn,
      setItems,
      setHasMore,
      setLoading,
      setShouldShow,
      props.count,
    ]);

    const fetchMore = React.useCallback(() => {
      setLoading(true);
      props
        .fetchDataFn(fetcher, props.count, config.paginationIndexer(items))
        .then((nextItems) => {
          setItems(items.concat(nextItems));
          setHasMore(nextItems.length >= props.count);
        })
        .catch((err: Error) => console.error(err))
        .then(() => setLoading(false));
    }, [
      fetcher,
      props.fetchDataFn,
      setItems,
      setHasMore,
      setLoading,
      items,
      props.count,
    ]);

    React.useEffect(() => {
      fetch();
    }, []);

    if (!shouldShow) {
      return <PaginationSpinner />;
    }
    return (
      <>
        {config.hasUpdateButton ? <UpdateBlockHeight onClick={fetch} /> : null}
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={
            loading ? (
              <PaginationSpinner />
            ) : (
              <>
                <LoadButton onClick={fetchMore} visible={hasMore}>
                  {t("button.load_more")}
                </LoadButton>
              </>
            )
          }
          style={{ overflowX: "hidden" }}
        >
          <config.Component items={items} />
        </InfiniteScroll>
      </>
    );
  });
};

export default Wrapper;
