export function truncateAccountId(
  accountId: string,
  lengthThreshold: number = 25
) {
  return accountId.length > lengthThreshold
    ? accountId.slice(0, 5) + "…" + accountId.slice(accountId.length - 10)
    : accountId;
}
