import * as React from "react";

import Link from "@explorer/frontend/components/utils/Link";
import { truncateAccountId } from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";

const AccountLinkWrapper = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
}

const AccountLink: React.FC<Props> = React.memo(({ accountId }) => (
  <Link href={`/accounts/${accountId}`} passHref>
    <AccountLinkWrapper>{truncateAccountId(accountId)}</AccountLinkWrapper>
  </Link>
));

export default AccountLink;
