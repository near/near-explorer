import * as React from "react";

import { intervalToDuration } from "date-fns";

import { SSRContext } from "@explorer/frontend/context/SSRContext";
import { useDateLocale } from "@explorer/frontend/hooks/use-date-locale";
import {
  SECOND,
  formatDurationString,
} from "@explorer/frontend/libraries/time";

interface Props {
  time: number;
}

const Timer: React.FC<Props> = React.memo(({ time }) => {
  const [now, setNow] = React.useState<Date>(new Date());
  React.useEffect(() => {
    const timeToSecond = SECOND - now.getMilliseconds();
    let intervalId: NodeJS.Timer | undefined;
    const callback = () => setNow(new Date());
    const timeoutId = setTimeout(() => {
      callback();
      intervalId = setInterval(callback, SECOND);
    }, timeToSecond);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);
  const locale = useDateLocale();
  const ssrContext = React.useContext(SSRContext);
  const formatTimePassed = React.useCallback(
    (startTimestamp: number | Date, endTimestamp: Date) => {
      const duration = intervalToDuration({
        start: startTimestamp,
        end: ssrContext.isFirstRender ? ssrContext.nowTimestamp : endTimestamp,
      });
      return formatDurationString(duration, locale.durationFormatter);
    },
    [locale, ssrContext.isFirstRender, ssrContext.nowTimestamp]
  );
  return <span>{formatTimePassed(time, now)}</span>;
});

export default Timer;
