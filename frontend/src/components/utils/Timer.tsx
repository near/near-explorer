import { PureComponent } from "react";
import Moment from "../../libraries/moment";

interface Props {
  time?: number;
}

interface State {
  time: Date | number;
  timeStr: string;
}

class Timer extends PureComponent<Props, State> {
  timer?: number;

  constructor(props: Props) {
    super(props);

    const time = props.time === undefined ? new Date() : props.time;
    this.state = {
      time,
      timeStr: this.formatTime(time),
    };
  }

  componentDidMount() {
    this.timer = window.setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate() {
    const time = this.props.time === undefined ? new Date() : this.props.time;
    this.setState({
      time,
      timeStr: this.formatTime(time),
    });
  }

  formatTime(time: number | Date) {
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
