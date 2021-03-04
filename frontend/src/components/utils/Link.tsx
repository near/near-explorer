import Link from "next/link";
import React from "react";

interface Props {
  href: string;
  as?: string;
  children: React.ReactNode;
}

const LinkWrapper = ({ href, as, children }: Props) => {
  return (
    <>
      <Link href={href} as={as}>
        {children}
      </Link>
    </>
  );
};

export default LinkWrapper;
