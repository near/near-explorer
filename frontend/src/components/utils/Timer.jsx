import Moment from "../../libraries/moment";

export default class extends React.PureComponent {
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

  newDate = new Date();

  componentDidUpdate() {
    const time = this.props.time === undefined ? this.newDate : this.props.time;
    this.setState({
      time: time,
      timeStr: this.formatTime(time)
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
    console.log(this.state.time, "  state");
    console.log(this.props.time, "  props");
    console.log(this.state.timeStr);
    return <span>{this.state.timeStr}</span>;
  }
}
