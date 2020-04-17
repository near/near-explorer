import InfiniteScroll from "react-infinite-scroll-component";

import React from "react";

import PaginationSpinner from "./PaginationSpinner";

interface Config {
  fetchDataFn: Function;
  count: number;
  category: string;
  dashboard?: boolean;
}

export default (
  WrappedComponent: React.ComponentType<any>,
  config: Config,
  props?: any
) => {
  return class extends React.Component {
    constructor(props: any) {
      super(props);
      this.timer = null;
    }

    timer: ReturnType<typeof setTimeout> | null;

    state = {
      items: Array<any>(),
      itemsLength: config.count,
      display: false,
      hasMore: true,
      loading: false
    };

    componentDidMount() {
      this.timer = setTimeout(this.regularFetchInfo, 0);
    }

    componentWillUnmount() {
      const timer = this.timer;
      this.timer = null;
      if (timer !== null) {
        clearTimeout(timer);
      }
    }

    componentDidUpdate(preProps: any) {
      if (this.props !== preProps) {
        this.setState({
          items: Array<any>(),
          itemsLength: config.count,
          display: false,
          hasMore: true,
          loading: false
        });
      }
    }

    regularFetchInfo = () => {
      if (config.dashboard) {
        this.setState({ hasMore: false });
      }
      if (this.state.itemsLength > 0) {
        this.fetchInfo(this.state.itemsLength);
        if (this.timer !== null) {
          this.timer = setTimeout(this.regularFetchInfo, 10000);
        }
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
              display: true
            };
            if (items.length < config.count) {
              newState.hasMore = false;
            }
          } else {
            newState = {
              hasMore: false,
              display: true,
              itemsLength: 0
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
      const endTimestamp = this.getEndTimestamp(config.category);
      config
        .fetchDataFn(config.count, endTimestamp)
        .then((newData: any) => {
          let newState: any;
          if (newData.length > 0) {
            const items = this.state.items.concat(newData);
            newState = {
              items,
              itemsLength: items.length,
              loading: false
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

    getEndTimestamp = (category: string) => {
      let endTimestamp;
      switch (category) {
        case "Account":
          endTimestamp =
            this.state.items[this.state.items.length - 1]
              .createdAtBlockTimestamp *
              1000000 +
            this.state.items[this.state.items.length - 1].accountIndex;
          break;
        case "Block":
          endTimestamp = this.state.items[this.state.items.length - 1]
            .timestamp;
          break;
        case "Node":
          endTimestamp = this.state.items[this.state.items.length - 1].lastSeen;
          break;
        case "Transaction":
          endTimestamp = this.state.items[this.state.items.length - 1]
            .blockTimestamp;
          break;
        default:
          endTimestamp = undefined;
      }
      console.log(endTimestamp);
      return endTimestamp;
    };

    render() {
      if (!this.state.display) {
        return <PaginationSpinner hidden={false} />;
      }
      return (
        <>
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
                    style={{ display: this.state.hasMore ? "block" : "none" }}
                  >
                    Load More
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
              font-family: BentonSans;
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
    }
  };
};
