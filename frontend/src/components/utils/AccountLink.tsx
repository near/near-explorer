import Link from "../utils/Link";
import { truncateAccountId } from "../../libraries/formatting";

export interface Props {
  accountId: string;
}

const AccountLink = ({ accountId }: Props) => {
  return (
    <>
      <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
        <a className="account-link">{truncateAccountId(accountId)}</a>
      </Link>
      <style jsx>{`
        .account-link {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default AccountLink;
