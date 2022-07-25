import { useRouter } from "next/router";

type BaseAccountPageOptions = {
  accountId: string;
};

export type FungibleTokensAccountPageOptions = BaseAccountPageOptions & {
  tab: "fungible-tokens";
  token?: string;
};

export type ActivityAccountPageOptions = BaseAccountPageOptions & {
  tab: "activity";
};

export type NonFungibleTokensAccountPageOptions = BaseAccountPageOptions & {
  tab: "collectibles";
};

export type AccountPageOptions =
  | FungibleTokensAccountPageOptions
  | ActivityAccountPageOptions
  | NonFungibleTokensAccountPageOptions;

export type AccountTab = AccountPageOptions["tab"];

export const parseAccountSlug = (slug: string[]): AccountPageOptions => {
  const [accountId, tab, ...restSlug] = slug.filter(Boolean);
  if (!accountId) {
    throw new Error("No account id in slug");
  }
  if (tab) {
    switch (tab) {
      case "fungible-tokens": {
        if (restSlug.length > 1) {
          throw new Error("Too many parameters in slug");
        }
        return {
          accountId,
          tab: "fungible-tokens",
          token: restSlug[0],
        };
      }
      case "activity": {
        if (restSlug.length > 0) {
          throw new Error("Too many parameters in slug");
        }
        return {
          accountId,
          tab: "activity",
        };
      }
      case "collectibles": {
        if (restSlug.length > 0) {
          throw new Error("Too many parameters in slug");
        }
        return {
          accountId,
          tab: "collectibles",
        };
      }
      default:
        throw new Error(`Unknown tab: ${tab}`);
    }
  }
  return {
    accountId,
    tab: "activity",
  };
};

const getAccountTabParts = (options: AccountPageOptions) => {
  switch (options.tab) {
    case "fungible-tokens":
      return [options.tab, options.token];
    case "activity":
      return [];
    case "collectibles":
      return [options.tab];
  }
};

export const buildAccountUrl = (options: AccountPageOptions) => {
  return [
    "/beta",
    "accounts",
    options.accountId,
    ...getAccountTabParts(options),
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
