import Link from "next/link";
import React from "react";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

const LinkWrapper = (props: React.ComponentProps<typeof Link>) => {
  const track = useAnalyticsTrack();

  return (
    <span
      onClick={() =>
        track("Explorer Click Link", {
          href: props.href,
          as: props.as ? props.as : "",
        })
      }
    >
      <Link {...props} />
    </span>
  );
};

export default LinkWrapper;
