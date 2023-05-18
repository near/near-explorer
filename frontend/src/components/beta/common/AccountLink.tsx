import * as React from "react";

import Link from "@/frontend/components/utils/Link";
import { shortenString } from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";

const AccountLinkWrapper = styled(Link, {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
}

const AccountLink: React.FC<Props> = React.memo(({ accountId }) => (
  <AccountLinkWrapper href={`/accounts/${accountId}`}>
    {shortenString(accountId)}
  </AccountLinkWrapper>
));

export default AccountLink;
