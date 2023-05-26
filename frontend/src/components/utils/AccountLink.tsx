import * as React from "react";

import { Link } from "@/frontend/components/utils/Link";
import { truncateAccountId } from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";

const AccountLinkWrapper = styled(Link, {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
}

export const AccountLink: React.FC<Props> = React.memo(({ accountId }) => (
  <AccountLinkWrapper href={`/accounts/${accountId}`}>
    {truncateAccountId(accountId)}
  </AccountLinkWrapper>
));
