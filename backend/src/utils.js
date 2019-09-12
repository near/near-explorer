class Result {
  contructor() {
    this.value = undefined;
    this.error = undefined;
  }

  isError() {
    return this.error !== undefined;
  }
}

exports.Result = Result;
