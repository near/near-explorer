import * as React from "react";
import { useEverySecond } from "../../hooks/use-every-second";
import moment from "../../libraries/moment";

interface Props {
  time?: number;
}

const Timer: React.FC<Props> = React.memo((props) => {
  const [, setCounter] = React.useState(0);
  useEverySecond(() => setCounter((c) => c + 1), [setCounter, props.time], {
    runOnMount: true,
  });
  return <span>{moment(props.time).fromNow()}</span>;
});

export default Timer;
