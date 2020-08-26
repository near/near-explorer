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

exports.Result = Result;
exports.promiseResult = promiseResult;
exports.delayFor = delayFor;
