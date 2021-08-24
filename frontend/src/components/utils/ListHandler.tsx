import InfiniteScroll from "react-infinite-scroll-component";

import { Component } from "react";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import PaginationSpinner from "./PaginationSpinner";
import Update from "./Update";

import { Translate } from "react-localize-redux";

interface Config {
  fetchDataFn: Function;
  count: number;
  category: string;
  detailPage?: boolean;
}

const Wrapper = (
  WrappedComponent: React.ComponentType<any>,
  config: Config,
  props?: any
) => {
  return class extends Component {
    constructor(props: any) {
      super(props);
    }

    state = {
      items: Array<any>(),
      itemsLength: config.count,
      display: false,
      hasMore: true,
      loading: false,
    };

    componentDidMount() {
      this.regularFetchInfo();
    }

    componentDidUpdate(preProps: any) {
      if (this.props !== preProps) {
        this.setState(
          {
            items: Array<any>(),
            itemsLength: config.count,
            display: false,
            hasMore: true,
            loading: false,
          },
          () => {
            this.regularFetchInfo();
          }
        );
      }
    }

    regularFetchInfo = () => {
      if (this.state.itemsLength > 0) {
        this.fetchInfo(this.state.itemsLength);
      }
    };

    fetchInfo = (count: number) => {
      config
        .fetchDataFn(count)
        .then((items: any) => {
          let newState: any;
          if (items.length > 0) {
            newState = {
              items,
              itemsLength: items.length,
              display: true,
              hasMore: true,
            };
            if (items.length < config.count) {
              newState.hasMore = false;
            }
          } else {
            newState = {
              hasMore: false,
              display: true,
              itemsLength: 0,
            };
          }
          this.setState(newState);
        })
        .catch((err: Error) => {
          console.error(err);
        });
    };

    fetchMoreData = async () => {
      this.setState({ loading: true });
      const paginationIndexer = this.getPaginationIndexer(config.category);
      config
        .fetchDataFn(config.count, paginationIndexer)
        .then((newData: any) => {
          let newState: any;
          if (newData.length > 0) {
            const items = this.state.items.concat(newData);
            newState = {
              items,
              itemsLength: items.length,
              loading: false,
              hasMore: true,
            };
            if (newData.length < config.count) {
              newState.hasMore = false;
            }
          } else {
            newState = { hasMore: false, loading: false };
          }
          this.setState(newState);
        })
        .catch((err: Error) => console.error(err));
    };

    getPaginationIndexer = (category: string) => {
      let paginationIndexer;
      switch (category) {
        case "Account":
          paginationIndexer = {
            endTimestamp: this.state.items[this.state.items.length - 1]
              .createdAtBlockTimestamp
              ? this.state.items[this.state.items.length - 1]
                  .createdAtBlockTimestamp
              : undefined,
            accountIndex: this.state.items[this.state.items.length - 1]
              .accountIndex,
          };
          break;
        case "Block":
          paginationIndexer = this.state.items[this.state.items.length - 1]
            .timestamp;
          break;
        case "Transaction":
          paginationIndexer = {
            endTimestamp: this.state.items[this.state.items.length - 1]
              .blockTimestamp,
            transactionIndex: this.state.items[this.state.items.length - 1]
              .transactionIndex,
          };
          break;
        default:
          paginationIndexer = undefined;
      }
      return paginationIndexer;
    };

    render() {
      if (!this.state.display) {
        return <PaginationSpinner hidden={false} />;
      }
      return (
        <Translate>
          {({ translate }) => (
            <>
              {!config.detailPage ? (
                <DatabaseConsumer>
                  {(context) => (
                    <div
                      onClick={() => {
                        this.regularFetchInfo();
                      }}
                    >
                      {config.category === "Block" ? (
                        <Update>{`${translate(
                          "utils.ListHandler.last_block"
                        ).toString()}#${context.latestBlockHeight}.`}</Update>
                      ) : null}
                    </div>
                  )}
                </DatabaseConsumer>
              ) : null}
              <InfiniteScroll
                dataLength={this.state.items.length}
                next={this.fetchMoreData}
                hasMore={this.state.hasMore}
                loader={
                  this.state.loading ? (
                    <PaginationSpinner hidden={false} />
                  ) : (
                    <>
                      <button
                        onClick={this.fetchMoreData}
                        className="load-button"
                        style={{
                          display: this.state.hasMore ? "block" : "none",
                        }}
                      >
                        {translate("button.load_more").toString()}
                      </button>
                    </>
                  )
                }
                style={{ overflowX: "hidden" }}
              >
                <WrappedComponent items={this.state.items} {...props} />
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
          )}
        </Translate>
      );
    }
  };
};

export default Wrapper;
