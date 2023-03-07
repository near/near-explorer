import * as React from "react";

import Link from "@explorer/frontend/components/utils/Link";
import { styled } from "@explorer/frontend/libraries/styles";

export interface Props {
  blockHash: string;
  blockHeight: number;
}

const LinkWrapper = styled(Link, {
  whiteSpace: "nowrap",
});

const BlockLink: React.FC<Props> = React.memo(({ blockHash, blockHeight }) => (
  <LinkWrapper href={`/blocks/${blockHash}`}>{`#${blockHeight}`}</LinkWrapper>
));

export default BlockLink;
