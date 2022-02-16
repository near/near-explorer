import Link from "../utils/Link";
import { truncateAccountId } from "../../libraries/formatting";
import { styled } from "../../libraries/styles";

const AccountLinkWrapper = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
}

const AccountLink = ({ accountId }: Props) => {
  return (
    <Link href="/accounts/[id]" as={`/accounts/${accountId}`} passHref>
      <AccountLinkWrapper>{truncateAccountId(accountId)}</AccountLinkWrapper>
    </Link>
  );
};

export default AccountLink;
