import Link from "next/link";
import React from "react";

interface Props {
  href: string;
  as?: string;
  children: React.ReactNode;
}

export default ({ href, as, children }: Props) => {
  return (
    <span>
      <Link href={href} as={as}>
        {children}
      </Link>
    </span>
  );
};
