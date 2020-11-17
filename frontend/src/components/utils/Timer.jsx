import Moment from "../../libraries/moment";
import BN from "bn.js";

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    let time = props.time === undefined ? new Date() : props.time;
    if (typeof time === "string") {
      time = new BN(time).div(new BN(10 ** 6)).toNumber();
    }
    this.state = {
      time,
      timeStr: this.formatTime(time),
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate() {
    let time = this.props.time === undefined ? new Date() : this.props.time;
    if (typeof time === "string") {
      time = new BN(time).div(new BN(10 ** 6)).toNumber();
    }
    this.setState({
      time,
      timeStr: this.formatTime(time),
    });
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
