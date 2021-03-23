class Result {
  contructor() {
    this.value = undefined;
    this.error = undefined;
  }

  isError() {
    return this.error !== undefined;
  }
}

function promiseResult(promise) {
  // Convert a promise to an always-resolving promise of Result type.
  return new Promise((resolve) => {
    const payload = new Result();
    promise
      .then((result) => {
        payload.value = result;
      })
      .catch((error) => {
        payload.error = error;
      })
      .then(() => {
        resolve(payload);
      });
  });
}

function delayFor(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)} 23:59:59`;
}

function generateDateArray(startDate, endDate = new Date()) {
  for (
    var arr = [], dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(formatDate(new Date(dt)));
  }
  return arr;
}

function cumulativeAccountsCountArray(array) {
  return array.reduce((r, a) => {
    if (r.length > 0) a.accountsCount += r[r.length - 1].accountsCount;
    r.push(a);
    return r;
  }, Array());
}

exports.promiseResult = promiseResult;
exports.delayFor = delayFor;
exports.formatDate = formatDate;
exports.generateDateArray = generateDateArray;
exports.cumulativeAccountsCountArray = cumulativeAccountsCountArray;
