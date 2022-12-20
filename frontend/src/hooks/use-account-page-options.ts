import { useRouter } from "next/router";

type BaseAccountPageOptions = {
  accountId: string;
};

export type FungibleTokensAccountPageOptions = BaseAccountPageOptions & {
  tab: "fungible-tokens";
  token?: string;
};

export type TransactionsAccountPageOptions = BaseAccountPageOptions & {
  tab: "transactions";
};

export type NonFungibleTokensAccountPageOptions = BaseAccountPageOptions & {
  tab: "collectibles";
};

export type AccountPageOptions =
  | FungibleTokensAccountPageOptions
  | TransactionsAccountPageOptions
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
          tab: "transactions",
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
    tab: "transactions",
  };
};

const getAccountTabParts = (options: AccountPageOptions) => {
  switch (options.tab) {
    case "fungible-tokens":
      return [options.tab, options.token];
    case "transactions":
      return [];
    case "collectibles":
      return [options.tab];
  }
};

export const buildAccountUrl = (options: AccountPageOptions) => {
  return ["/accounts", options.accountId, ...getAccountTabParts(options)]
    .filter(Boolean)
    .join("/");
};

export const useAccountPageOptions = (): AccountPageOptions => {
  const router = useRouter();
  const pathElements = router.pathname.split("/").filter(Boolean);
  const isRegularAccountPage = pathElements[0] === "accounts";
  const isBetaAccountPage =
    pathElements[0] === "beta" && pathElements[1] === "accounts";
  if (!isRegularAccountPage && !isBetaAccountPage) {
    throw new Error(
      "useAccountPageOptions hook is used in non-account subpage!"
    );
  }
  return parseAccountSlug(router.query.slug as string[]);
};
