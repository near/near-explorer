import * as React from "react";
import Link from "../../utils/Link";
import { shortenString } from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";

const AccountLinkWrapper = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
}

const AccountLink: React.FC<Props> = React.memo(({ accountId }) => {
  return (
    <Link href={`/accounts/${accountId}`} passHref>
      <AccountLinkWrapper>{shortenString(accountId)}</AccountLinkWrapper>
    </Link>
  );
});

export default AccountLink;
