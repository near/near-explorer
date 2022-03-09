function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)} 23:59:59`;
}

function generateDateArray(
  startDate: string,
  endDate: Date = new Date()
): string[] {
  for (
    var arr = [], dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(formatDate(new Date(dt)));
  }
  return arr;
}

function cumulativeAccountsCountArray<T extends { accountsCount: number }>(
  array: T[]
): T[] {
  return array.reduce((r, a) => {
    if (r.length > 0) a.accountsCount += r[r.length - 1].accountsCount;
    r.push(a);
    return r;
  }, Array());
}

const MAX_LOGGABLE_CHARS = 100;
function trimError(e: unknown): string {
  const stringifiedError = String(e);
  return `${stringifiedError.slice(0, MAX_LOGGABLE_CHARS)}${
    stringifiedError.length > MAX_LOGGABLE_CHARS
      ? `... (${stringifiedError.length - MAX_LOGGABLE_CHARS} symbols more)`
      : ""
  }`;
}

export {
  formatDate,
  generateDateArray,
  cumulativeAccountsCountArray,
  trimError,
};
