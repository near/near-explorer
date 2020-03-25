import React from "react";

export default (
  WrappedComponent: React.ComponentType<any>,
  fetchDataFn: Function,
  props?: any
) => {
  return class extends React.Component {
    constructor(props: any) {
      super(props);
      this.timer = null;
    }

    timer: ReturnType<typeof setTimeout> | null;

    state = {
      items: []
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
        this.setState({ items: [] }, this.fetchInfo);
      }
    }

    fetchInfo = () => {
      fetchDataFn()
        .then((items: any) => {
          this.setState({ items });
        })
        .catch((err: any) => {
          console.error(err);
        });
    };

    regularFetchInfo = () => {
      this.fetchInfo();
      if (this.timer !== null) {
        this.timer = setTimeout(this.regularFetchInfo, 10000);
      }
    };

    render() {
      return <WrappedComponent items={this.state.items} {...props} />;
    }
  };
};
