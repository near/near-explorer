import * as React from "react";
import Link from "../../utils/Link";
import { styled } from "../../../libraries/styles";
import { TransactionBlockInfo } from "../../../types/transaction";

export interface Props {
  block: TransactionBlockInfo;
}

const LinkWrapper = styled("a", {
  whiteSpace: "nowrap",
  cursor: "pointer",
});

const BlockLink: React.FC<Props> = React.memo(({ block }) => (
  <Link href="/blocks/[hash]" as={`/blocks/${block.hash}`}>
    <LinkWrapper>{`#${block.height}`}</LinkWrapper>
  </Link>
));

export default BlockLink;
