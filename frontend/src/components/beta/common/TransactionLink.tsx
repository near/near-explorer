import * as React from "react";

import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import Link from "@explorer/frontend/components/utils/Link";
import { shortenString } from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";

const TransactionLinkWrapper = styled(Link, {
  whiteSpace: "nowrap",
});

export interface Props {
  hash: string;
}

const TransactionLink: React.FC<Props> = React.memo(({ hash }) => (
  <>
    <TransactionLinkWrapper href={`/transactions/${hash}`}>
      {shortenString(hash)}
    </TransactionLinkWrapper>
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
