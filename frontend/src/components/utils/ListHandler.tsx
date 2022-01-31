import InfiniteScroll from "react-infinite-scroll-component";

import { FC, useCallback, useEffect, useState } from "react";

import PaginationSpinner from "./PaginationSpinner";
import Update from "./Update";

import { useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import { WampCall } from "../../libraries/wamp/api";
import { useWampCall } from "../../hooks/wamp";

interface StaticConfig<T, I> {
  Component: FC<{ items: T[] }>;
  category: string;
  paginationIndexer: (items: T[]) => I;
  hasUpdateButton?: boolean;
}

interface Props<T, I> {
  count: number;
  fetchDataFn: (wampCall: WampCall, count: number, indexer?: I) => Promise<T[]>;
}

type UpdateBlockHeightProps = {
  onClick: () => void;
};

const UpdateBlockHeight: FC<UpdateBlockHeightProps> = (props) => {
  const { t } = useTranslation();
  const latestBlockHeight = useLatestBlockHeight();
  return (
    <div onClick={props.onClick}>
      <Update>{`${t(
        "utils.ListHandler.last_block"
      )}#${latestBlockHeight}.`}</Update>
    </div>
  );
};

const Wrapper = <T, I>(config: StaticConfig<T, I>): FC<Props<T, I>> => {
  return (props) => {
    const { t } = useTranslation();
    const [items, setItems] = useState<T[]>([]);
    const [shouldShow, setShouldShow] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const wampCall = useWampCall();

    const fetch = useCallback(() => {
      setLoading(true);
      props
        .fetchDataFn(wampCall, props.count)
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
      wampCall,
      props.fetchDataFn,
      setItems,
      setHasMore,
      setLoading,
      setShouldShow,
      props.count,
    ]);

    const fetchMore = useCallback(() => {
      setLoading(true);
      props
        .fetchDataFn(wampCall, props.count, config.paginationIndexer(items))
        .then((nextItems) => {
          setItems(items.concat(nextItems));
          setHasMore(nextItems.length >= props.count);
        })
        .catch((err: Error) => console.error(err))
        .then(() => setLoading(false));
    }, [
      wampCall,
      props.fetchDataFn,
      setItems,
      setHasMore,
      setLoading,
      items,
      props.count,
    ]);

    useEffect(() => {
      fetch();
    }, []);

    if (!shouldShow) {
      return <PaginationSpinner hidden={false} />;
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
              <PaginationSpinner hidden={false} />
            ) : (
              <>
                <button
                  onClick={fetchMore}
                  className="load-button"
                  style={{
                    display: hasMore ? "block" : "none",
                  }}
                >
                  {t("button.load_more")}
                </button>
              </>
            )
          }
          style={{ overflowX: "hidden" }}
        >
          <config.Component items={items} />
        </InfiniteScroll>
        <style jsx global>{`
          .load-button {
            width: 100px;
            background-color: #f8f8f8;
            display: block;
            text-align: center;
            text-decoration: none;
            font-size: 14px;
            color: #0072ce;
            font-weight: bold;
            text-transform: uppercase;
            margin: 20px auto;
            border-radius: 30px;
            padding: 8px 0;
            cursor: pointer;
            border: none;
          }
        `}</style>
      </>
    );
  };
};

export default Wrapper;
