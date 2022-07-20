import * as React from "react";
import { useEverySecond } from "../../hooks/use-every-second";
import { useFormatDistanceToNow } from "../../hooks/use-format-distance-to-now";

interface Props {
  time?: number;
}

const Timer: React.FC<Props> = React.memo((props) => {
  const [, setCounter] = React.useState(0);
  useEverySecond(() => setCounter((c) => c + 1), [setCounter, props.time], {
    runOnMount: true,
  });
  const formatDuration = useFormatDistanceToNow();
  return <span>{formatDuration(props.time || new Date())}</span>;
});

export default Timer;
