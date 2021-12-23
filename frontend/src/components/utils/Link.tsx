import Link from "next/link";
import React from "react";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

interface Props {
  href: string;
  as?: string;
  children: React.ReactNode;
}

const LinkWrapper = ({ href, as, children }: Props) => {
  const track = useAnalyticsTrack();

  return (
    <span
      onClick={() =>
        track("Explorer Click Link", {
          href: href,
          as: as ? as : "",
        })
      }
    >
      <Link href={href} as={as}>
        {children}
      </Link>
    </span>
  );
};

export default LinkWrapper;
