import { useRouter } from "next/router";

type BaseAccountPageOptions = {
  accountId: string;
};

export type FungibleTokensAccountPageOptions = BaseAccountPageOptions & {
  tab: "fungible-tokens";
  token?: string;
};

export type AccountPageOptions = FungibleTokensAccountPageOptions;

export type AccountTab = AccountPageOptions["tab"];

export const parseAccountSlug = (slug: string[]): AccountPageOptions => {
  const [accountId, tab, ...restSlug] = slug.filter(Boolean);
  if (!accountId) {
    throw new Error("No account id in slug");
  }
  if (tab) {
    if (tab === "fungible-tokens") {
      if (restSlug.length > 1) {
        throw new Error("Too many parameters in slug");
      }
      return {
        accountId,
        tab: "fungible-tokens",
        token: restSlug[0],
      };
    }
    throw new Error(`Unknown tab: ${tab}`);
  }
  return {
    accountId,
    tab: "fungible-tokens",
  };
};

export const buildAccountUrl = (options: AccountPageOptions) => {
  return [
    "/beta",
    "accounts",
    options.accountId,
    options.tab,
    "token" in options ? options.token : undefined,
  ]
    .filter(Boolean)
    .join("/");
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
