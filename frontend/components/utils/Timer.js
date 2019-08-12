import { Component } from "react";

import Moment from "./Moment";

class Timer extends Component {
  constructor(props) {
    super(props);

    const time = props.time === undefined ? new Date() : props.time;
    this.state = {
      time,
      timeStr: this.formatTime(time)
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  formatTime(time) {
    return Moment(time).fromNow();
  }

  tick = () => {
    this.setState(({ time }) => {
      return { timeStr: this.formatTime(time) };
    });
  };

  render() {
    return <span>{this.state.timeStr}</span>;
  }
}

export default Timer;
