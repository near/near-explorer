import * as React from "react";
import Link from "../../utils/Link";
import { styled } from "../../../libraries/styles";

export interface Props {
  blockHash: string;
  blockHeight: number;
}

const LinkWrapper = styled("a", {
  whiteSpace: "nowrap",
  cursor: "pointer",
});

const BlockLink: React.FC<Props> = React.memo(({ blockHash, blockHeight }) => (
  <Link href="/blocks/[hash]" as={`/blocks/${blockHash}`}>
    <LinkWrapper>{`#${blockHeight}`}</LinkWrapper>
  </Link>
));

export default BlockLink;
