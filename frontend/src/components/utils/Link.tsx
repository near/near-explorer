import Link from "next/link";
import * as React from "react";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

const LinkWrapper: React.FC<React.ComponentProps<typeof Link>> = React.memo(
  (props) => {
    const track = useAnalyticsTrack();

    return (
      <span
        onClick={() =>
          track("Explorer Click Link", {
            href: props.href,
          })
        }
      >
        <Link {...props} />
      </span>
    );
  }
);

export default LinkWrapper;
