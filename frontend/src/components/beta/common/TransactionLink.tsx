import * as React from "react";

import { CopyToClipboard } from "@/frontend/components/utils/CopyToClipboard";
import { Link } from "@/frontend/components/utils/Link";
import { shortenString } from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";

const TransactionLinkWrapper = styled(Link, {
  whiteSpace: "nowrap",
});

export interface Props {
  hash: string;
}

export const TransactionLink: React.FC<Props> = React.memo(({ hash }) => (
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
