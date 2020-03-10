import React from "react";

export default (
  WrappedComponent: React.ComponentType<any>,
  fetchDataFn: Function
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
      clearTimeout(this.timer!);
      this.timer = null;
    }

    regularFetchInfo = async () => {
      const items = await fetchDataFn();
      if (items.length > 0) {
        this.setState({ items });
      } else {
        console.error(items);
      }
      if (this.timer !== null) {
        this.timer = setTimeout(this.regularFetchInfo, 10000);
      }
    };

    render() {
      return <WrappedComponent items={this.state.items} {...this.props} />;
    }
  };
};
