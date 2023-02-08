import * as React from "react";

import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import Link from "@explorer/frontend/components/utils/Link";
import { shortenString } from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";

const TransactionLinkWrapper = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  hash: string;
}

const TransactionLink: React.FC<Props> = React.memo(({ hash }) => (
  <>
    <Link href={`/transactions/${hash}`} passHref>
      <TransactionLinkWrapper>{shortenString(hash)}</TransactionLinkWrapper>
    </Link>
    <CopyToClipboard
      text={hash}
      css={{
        marginLeft: ".3em",
        fontSize: "1.5em",
      }}
    />
  </>
));

export default TransactionLink;
