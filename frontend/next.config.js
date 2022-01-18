// Jest registers ts-node for us, double run of ts-node/register will break code
const tsNodeRegistrer = process[Symbol.for("ts-node.register.instance")];
if (tsNodeRegistrer) {
  tsNodeRegistrer.enabled(false);
}

require("ts-node").register(require("./nextjs.tsconfig.json"));

// There are no plans to add support for next.config.ts natively
// https://github.com/vercel/next.js/issues/5318
module.exports = require("./next.config.ts");
