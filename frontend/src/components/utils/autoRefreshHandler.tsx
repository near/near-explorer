import React from "react";

import PaginationSpinner from "./PaginationSpinner";

interface Config {
  fetchDataFn: Function;
  count: number;
  categary: string;
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
          items: Array<any>(),
          itemsLength: config.count,
          display: false,
          hasMore: true
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
      return;
    };

    fetchInfo = (count: number) => {
      config
        .fetchDataFn(count)
        .then((items: any) => {
          if (items.length > 0) {
            this.setState({ items, itemsLength: items.length, display: true });
          } else {
            this.setState({ hasMore: false, display: true, itemsLength: 0 });
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    };

    fetchMoreData = async () => {
      if (this.state.itemsLength > 0) {
        const endTimestamp = this.getEndTimestamp(config.categary);
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

    getEndTimestamp = (categary: string) => {
      let endTimestamp;
      switch (categary) {
        case "Account":
          endTimestamp = this.state.items[this.state.items.length - 1]
            .createdAtBlockTimestamp;
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
      return endTimestamp;
    };

    render() {
      return this.state.display ? (
        <>
          <WrappedComponent items={this.state.items} {...props} />
          {this.state.hasMore && (
            <button onClick={this.fetchMoreData}>Load More </button>
          )}
          <style jsx global>{`
            button {
              background-color: #6ad1e3;
              display: block;
              text-align: center;
              text-decoration: none;
              font-family: BentonSans;
              font-size: 14px;
              color: #fff;
              text-transform: uppercase;
              margin: 10px;
              border-radius: 25px;
              padding: 8px 10px;
            }
            button:hover,
            button:focus {
              background-color: #17a2b8;
            }
          `}</style>
        </>
      ) : (
        <PaginationSpinner hidden={false} />
      );
    }
  };
};
