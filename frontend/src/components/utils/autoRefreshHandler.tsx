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
    };

    componentDidMount() {
      // this.timer = setTimeout(this.regularFetchInfo, 0);
      this.fetchInfo(this.state.itemsLength);
    }

    // componentWillUnmount() {
    //   const timer = this.timer;
    //   this.timer = null;
    //   if (timer !== null) {
    //     clearTimeout(timer);
    //   }
    // }

    componentDidUpdate(preProps: any) {
      if (this.props !== preProps) {
        this.setState({
          items: null,
          itemsLength: config.count,
          display: false,
        });
      }
    }

    fetchInfo = (count: number) => {
      config
        .fetchDataFn(count)
        .then((items: any) => {
          console.log(items);
          this.setState({ items, display: true });
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
      if (this.state.items.length > 0) {
        const endTimestamp = this.state.items[this.state.items.length - 1]
          .timestamp;
        console.log(endTimestamp);
        const newData = await config.fetchDataFn(config.count, endTimestamp);
        const items = this.state.items.concat(newData);
        this.setState({ items, itemsLength: items.length });
      }
    };

    render() {
      console.log(this.state.items);
      return this.state.display ? (
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={config.dashboard ? false : true}
          loader={<PaginationSpinner hidden={false} />}
        >
          <WrappedComponent items={this.state.items} {...props} />
        </InfiniteScroll>
      ) : (
        <PaginationSpinner hidden={false} />
      );
    }
  };
};
