function toBase58(input) {
  if (typeof input === "string") {
    return input;
  }
  return bs58.encode(Buffer.from(input));
}

class Result {
  contructor() {
    this.value = undefined;
    this.error = undefined;
  }

  isError() {
    return this.error !== undefined;
  }
}

exports.toBase58 = toBase58;
exports.Result = Result;
