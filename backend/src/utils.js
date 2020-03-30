class Result {
  contructor() {
    this.value = undefined;
    this.error = undefined;
  }

  isError() {
    return this.error !== undefined;
  }
}

function delayFor(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

exports.Result = Result;
