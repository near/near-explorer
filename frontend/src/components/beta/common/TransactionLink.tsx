import * as React from "react";
import Link from "@explorer/frontend/components/utils/Link";
import { shortenString } from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";
import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";

const TransactionLinkWrapper = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  hash: string;
}

const TransactionLink: React.FC<Props> = React.memo(({ hash }) => {
  return (
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
  );
});

export default TransactionLink;
