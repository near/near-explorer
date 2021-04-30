import Link from "next/link";
import React from "react";
import Mixpanel from "../../libraries/mixpanel";
interface Props {
  href: string;
  as?: string;
  children: React.ReactNode;
}

const LinkWrapper = ({ href, as, children }: Props) => {
  return (
    <span
      onClick={() =>
        Mixpanel.track("Explorer Click Link", { href: href, as: as ? as : "" })
      }
    >
      <Link href={href} as={as}>
        {children}
      </Link>
    </span>
  );
};

export default LinkWrapper;
