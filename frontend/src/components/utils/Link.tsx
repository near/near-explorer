import * as React from "react";

import Link from "next/link";

import { useAnalyticsTrack } from "@explorer/frontend/hooks/analytics/use-analytics-track";

const LinkWrapper: React.FC<
  React.ComponentProps<typeof Link> & { className?: string }
> = React.memo(({ className, ...props }) => {
  const track = useAnalyticsTrack();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      className={className}
      onClick={() =>
        track("Explorer Click Link", {
          href: props.href,
        })
      }
    >
      {props.href ? <Link {...props} /> : props.children}
    </span>
  );
});

export default LinkWrapper;
