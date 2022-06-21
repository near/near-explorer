import { useRouter } from "next/router";

type BaseAccountPageOptions = {
  accountId: string;
};

export type AccountPageOptions = BaseAccountPageOptions;

export const parseAccountSlug = (slug: string[]): AccountPageOptions => {
  const [accountId, ...restSlug] = slug.filter(Boolean);
  if (!accountId) {
    throw new Error("No account id in slug");
  }
  if (restSlug.length !== 0) {
    throw new Error("Too many parameters in slug");
  }
  return {
    accountId,
  };
};

export const buildAccountUrl = (options: AccountPageOptions) => {
  return ["/beta", "accounts", options.accountId].filter(Boolean).join("/");
};

export const useAccountPageOptions = (): AccountPageOptions => {
  const router = useRouter();
  const pathElements = router.pathname.split("/").filter(Boolean);
  if (pathElements[1] !== "accounts") {
    throw new Error(
      "useAccountPageOptions hook is used in non-account subpage!"
    );
  }
  return parseAccountSlug(router.query.slug as string[]);
};
