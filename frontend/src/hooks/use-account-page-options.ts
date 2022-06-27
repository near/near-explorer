import { useRouter } from "next/router";

type BaseAccountPageOptions = {
  accountId: string;
};

export type ActivityAccountPageOptions = BaseAccountPageOptions & {
  tab: "activity";
};

export type AccountPageOptions = ActivityAccountPageOptions;

export type AccountTab = AccountPageOptions["tab"];

export const parseAccountSlug = (slug: string[]): AccountPageOptions => {
  const [accountId, tab, ...restSlug] = slug.filter(Boolean);
  if (!accountId) {
    throw new Error("No account id in slug");
  }
  if (tab) {
    if (tab === "activity") {
      if (restSlug.length > 0) {
        throw new Error("Too many parameters in slug");
      }
      return {
        accountId,
        tab: "activity",
      };
    }
    throw new Error(`Unknown tab: ${tab}`);
  }
  return {
    accountId,
    tab: "activity",
  };
};

export const buildAccountUrl = (options: AccountPageOptions) => {
  return [
    "/beta",
    "accounts",
    options.accountId,
    options.tab === "activity" ? undefined : options.tab,
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
