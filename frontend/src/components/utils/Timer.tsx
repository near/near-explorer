import * as React from "react";

import { useEverySecond } from "@explorer/frontend/hooks/use-every-second";
import { useFormatDistance } from "@explorer/frontend/hooks/use-format-distance";

interface Props {
  time?: number;
}

const Timer: React.FC<Props> = React.memo((props) => {
  const [, setCounter] = React.useState(0);
  // We need to update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEverySecond(
    React.useCallback(() => setCounter((c) => c + 1), [setCounter]),
    [props.time],
    { runOnMount: true }
  );
  const formatDuration = useFormatDistance();
  return <span>{formatDuration(props.time || new Date())}</span>;
});

export default Timer;
