import { Component } from "react";

import Moment from "./Moment";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: props.time === undefined ? new Date() : props.time,
      timeStr: ""
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => {
    this.setState({
      timeStr: Moment(this.state.time).fromNow()
    });
  };

  render() {
    return <span>{this.state.timeStr}</span>;
  }
}

export default Timer;
