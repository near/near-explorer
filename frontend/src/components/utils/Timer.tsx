import * as React from "react";
import Moment from "../../libraries/moment";

const TIMER_INTERVAL = 1000;

interface Props {
  time?: number;
}

const Timer: React.FC<Props> = React.memo((props) => {
  const getTimer = React.useCallback(
    () => (props.time === undefined ? new Date() : props.time),
    [props.time]
  );
  const [timestamp, setTimestamp] = React.useState(getTimer);
  React.useEffect(() => {
    const timerId = setInterval(() => setTimestamp(getTimer()), TIMER_INTERVAL);
    return () => clearInterval(timerId);
  }, [props.time, setTimestamp]);
  return <span>{Moment(timestamp).fromNow()}</span>;
});

export default Timer;
