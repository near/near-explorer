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
      Lists: []
    };

    componentDidMount() {
      this.timer = setTimeout(this.regularFetchInfo, 0);
    }

    componentWillUnmount() {
      clearTimeout(this.timer!);
      this.timer = null;
    }

    regularFetchInfo = async () => {
      const Lists = await fetchDataFn();
      if (Lists.length > 0) {
        this.setState({ Lists });
      } else {
        console.error(Lists);
      }
      if (this.timer !== null) {
        this.timer = setTimeout(this.regularFetchInfo, 10000);
      }
    };

    render() {
      return <WrappedComponent Lists={this.state.Lists} {...this.props} />;
    }
  };
};
