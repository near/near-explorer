import * as React from "react";

import Link from "@/frontend/components/utils/Link";

export interface Props {
  blockHash: string;
  truncate?: boolean;
  children?: React.ReactNode;
}

const BlockLink: React.FC<Props> = React.memo(
  ({ blockHash, children, truncate = true }) => (
    <Link href={`/blocks/${blockHash}`}>
      {children || (truncate ? `${blockHash.substring(0, 7)}...` : blockHash)}
    </Link>
  )
);

export default BlockLink;
