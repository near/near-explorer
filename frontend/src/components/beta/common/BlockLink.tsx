import * as React from "react";

import { Link } from "@/frontend/components/utils/Link";
import { styled } from "@/frontend/libraries/styles";

export interface Props {
  blockHash: string;
  blockHeight: number;
}

const LinkWrapper = styled(Link, {
  whiteSpace: "nowrap",
});

export const BlockLink: React.FC<Props> = React.memo(
  ({ blockHash, blockHeight }) => (
    <LinkWrapper href={`/blocks/${blockHash}`}>{`#${blockHeight}`}</LinkWrapper>
  )
);
