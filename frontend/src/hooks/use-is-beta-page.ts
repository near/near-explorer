import { useRouter } from "next/router";

export const useIsBetaPage = () => {
  const router = useRouter();
  const pathElements = router.pathname.split("/").filter(Boolean);
  const isAccountBetaPage =
    pathElements[0] === "accounts" && Boolean(pathElements[1]);
  const isTransactionBetaPage =
    pathElements[0] === "transactions" && Boolean(pathElements[1]);
  return isAccountBetaPage || isTransactionBetaPage;
};
