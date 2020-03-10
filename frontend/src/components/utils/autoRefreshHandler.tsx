import React from "react";
import PaginationSpinner from "./PaginationSpinner";

export default (
  WrappedComponent: React.ComponentType<any>,
  fetchDataFn: Function,
  update?: boolean,
  props?: any
) => {
  return class extends React.Component {
    constructor(props: any) {
      super(props);
      this.timer = null;
    }

    timer: ReturnType<typeof setTimeout> | null;

    state = {
      items: [],
      loading: false
    };

    componentDidMount() {
      this.timer = setTimeout(this.regularFetchInfo, 0);
    }

    componentWillUnmount() {
      clearTimeout(this.timer!);
      this.timer = null;
    }

    regularFetchInfo = async () => {
      if (update) {
        this.setState({ loading: true });
      }
      fetchDataFn()
        .then((items: any) => {
          this.setState({ items, loading: false });
        })
        .catch((err: any) => {
          console.error(err);
        });
      if (this.timer !== null) {
        this.timer = setTimeout(this.regularFetchInfo, 10000);
      }
    };

    render() {
      if (this.state.loading) {
        return <PaginationSpinner hidden={false} />;
      }
      return <WrappedComponent items={this.state.items} {...props} />;
    }
  };
};
