import * as React from "react";
import Link from "../../utils/Link";
import { shortenString } from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";
import CopyToClipboard from "../../utils/CopyToClipboard";

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
