import InfiniteScroll from "react-infinite-scroll-component";

import React from "react";

import PaginationSpinner from "./PaginationSpinner";

export default (
  WrappedComponent: React.ComponentType<any>,
  fetchDataFn: Function,
  count: number,
  scroll: boolean,
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
      count: count
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
        this.setState({ items: Array<any>(), count });
      }
    }

    fetchInfo = (count: number) => {
      fetchDataFn(count)
        .then((items: any) => {
          this.setState({ items });
        })
        .catch((err: any) => {
          console.error(err);
        });
    };

    regularFetchInfo = () => {
      this.fetchInfo(this.state.count);
      if (this.timer !== null) {
        this.timer = setTimeout(this.regularFetchInfo, 10000);
      }
    };

    fetchMoreData = async () => {
      if (this.state.items.length > 0) {
        const endTimestamp = this.state.items[this.state.items.length - 1]
          .timestamp;
        const newData = await fetchDataFn(count, endTimestamp);
        const items = this.state.items.concat(newData);
        this.setState({ items, count: items.length });
      }
    };

    render() {
      if (this.state.items.length > 0) {
        return (
          <InfiniteScroll
            dataLength={this.state.items.length}
            next={this.fetchMoreData}
            hasMore={scroll ? true : false}
            loader={<PaginationSpinner hidden={false} />}
          >
            <WrappedComponent items={this.state.items} {...props} />
          </InfiniteScroll>
        );
      }
      return <PaginationSpinner hidden={false} />;
    }
  };
};
