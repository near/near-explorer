import InfiniteScroll from "react-infinite-scroll-component";

import React from "react";

import PaginationSpinner from "./PaginationSpinner";

interface Config {
  fetchDataFn: Function;
  count: number;
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
      hasMore: true
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
          items: null,
          itemsLength: config.count,
          display: false,
          hasMore: true
        });
      }
    }

    fetchInfo = (count: number) => {
      config
        .fetchDataFn(count)
        .then((items: any) => {
          if (items.length > 0) {
            this.setState({ items, display: true });
          } else {
            this.setState({ hasMore: false, display: true });
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    };

    regularFetchInfo = () => {
      this.fetchInfo(this.state.itemsLength);
      if (this.timer !== null) {
        this.timer = setTimeout(this.regularFetchInfo, 10000);
      }
    };

    fetchMoreData = async () => {
      if (config.dashboard) {
        this.setState({ hasMore: false });
        return;
      }
      if (this.state.items.length > 0) {
        const endTimestamp = this.state.items[this.state.items.length - 1]
          .timestamp;
        const newData = await config.fetchDataFn(config.count, endTimestamp);
        if (newData.length > 0) {
          const items = this.state.items.concat(newData);
          this.setState({ items, itemsLength: items.length });
        } else {
          this.setState({ hasMore: false });
        }
        return;
      }
    };

    render() {
      return this.state.display ? (
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<p>Loading</p>}
        >
          <WrappedComponent items={this.state.items} {...props} />
        </InfiniteScroll>
      ) : (
        <PaginationSpinner hidden={false} />
      );
    }
  };
};
