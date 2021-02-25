export function truncateAccountId(
  accountId: string,
  lengthThreshold: number = 25
) {
  return accountId.length > lengthThreshold
    ? accountId.slice(0, 5) + "…" + accountId.slice(accountId.length - 10)
    : accountId;
}

export const cumulativeSumArray = (array: Array<number>) =>
  array.reduce((r, a) => {
    if (r.length > 0) a += r[r.length - 1];
    r.push(a);
    return r;
  }, Array());
